//* Raffle Unit tests- 7- performUpkeep

// This  is 'Raffle.test.js' file.

//* Test cases on 'performUpkeep' function

const { assert, expect } = require('chai');
const { getNamedAccounts, deployments, ethers, network } = require('hardhat');
const {
  developmentChains,
  networkConfig,
} = require('../../helper-hardhat-config');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Raffle unit tests', async function () {
      let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, interval;

      const chainId = network.config.chainId;

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(['all']);
        raffle = await ethers.getContract('Raffle', deployer);
        vrfCoordinatorV2Mock = await ethers.getContract(
          'VRFCoordinatorV2Mock',
          deployer
        );
        raffleEntranceFee = await raffle.getEntranceFee();

        interval = await raffle.getInterval();
      });

      describe('constructor', function () {
        it('Initializes the Raffle correctly', async function () {
          const raffleState = await raffle.getRaffleState();
          // const interval = await raffle.getInterval();
          assert.equal(raffleState.toString(), '0');
          assert.equal(interval.toString(), networkConfig[chainId]['interval']);
        });
      });

      describe('enter raffle', function () {
        it('reverts if you do not pay enough', async function () {
          await expect(raffle.enterRaffle()).to.be.revertedWith(
            'Raffle__NotEnoughEthEntered'
          );
        });

        it('records players when they enter raffle', async function () {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          const playerFromContract = await raffle.getPlayer('0');
          assert.equal(playerFromContract, deployer);
        });

        it('emits an event on enter', async function () {
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee })
          ).to.emit(raffle, 'RaffleEnter');
        });

        it('does not allow entering when raffle is calculating', async function () {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);

          await network.provider.request({ method: 'evm_mine', params: [] });
          await raffle.performUpkeep([]);
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee })
          ).to.be.revertedWith('Raffle__RaffleNotOpen');
        });
      });

      describe('checkUpkeep', function () {
        it('returns false if people have not sent any ETH', async function () {
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
          await network.provider.request({ method: 'evm_mine', params: [] });
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
          assert(!upkeepNeeded);
        });

        it("returns false if raffle isn't open", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
          await network.provider.request({ method: 'evm_mine', params: [] });

          await raffle.performUpkeep([]); // changes the state to from 'open' to 'calculating'
          const raffleState = await raffle.getRaffleState();
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep('0x');

          assert.equal(raffleState.toString(), '1');
          assert.equal(upkeepNeeded, false);
        });

        it("returns false if enough time hasn't passed", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() - 1,
          ]);
          await network.provider.request({ method: 'evm_mine', params: [] });
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep('0x');
          // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
          assert(!upkeepNeeded);
        });

        it('returns true if enough time has passed, has players, eth, and is open', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
          await network.provider.request({ method: 'evm_mine', params: [] });
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep('0x'); // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
          assert(upkeepNeeded);
        });
      });

      describe('performUpkeep', function () {
        it('it can only run if checkUpkeep is true', async () => {
          // For 'checkUpkeep' to be 'true', 'upkeepNeeded' needs to be returned 'true'.
          // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers);

          await raffle.enterRaffle({ value: raffleEntranceFee }); //isOpen && hasBalance && hasPlayers

          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
          await network.provider.request({ method: 'evm_mine', params: [] }); //timePassed

          //* Now 'upkeepNeeded' should be true, and hence 'checkUpkeep' should be 'true'. So now we can call 'performUpkeep'

          const tx = await raffle.performUpkeep([]); // if tx fails, then 'checkUpkeep' isn't true. Our test fails.
          assert(tx);
        });
      });
    });

/* 

yarn hardhat test --grep "it can only run if checkUpkeep is true"


  Raffle unit tests
    performUpkeep
      ✔ it can only run if checkUpkeep is true (103ms)


  1 passing (3s)

*/
