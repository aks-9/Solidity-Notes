//* Raffle Unit tests- 9

// This  is 'Raffle.test.js' file.

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
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
          await network.provider.request({ method: 'evm_mine', params: [] });

          const tx = await raffle.performUpkeep([]); // if tx fails, then 'checkUpkeep' isn't true. Our test fails.
          assert(tx);
        });

        it('reverts if checkup is false', async () => {
          await expect(raffle.performUpkeep('0x')).to.be.revertedWith(
            'Raffle__UpkeepNotNeeded'
          );
        });

        it('updates the raffle state, emits an event, and calls the vrf coordinator', async () => {
          //making the 'checkUpkeep' return 'true'.
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
          await network.provider.request({ method: 'evm_mine', params: [] });

          const txResponse = await raffle.performUpkeep([]); //changing the state
          const txReceipt = await txResponse.wait(1);

          // When we call 'requestRandomWords' on 'vrfCoordinator' contract, it emits an event 'RandomWordsRequested' that has 'requestId'. This event is emitted before the 'RequestedRaffleWinner' event in our Raffle contract. So the 'requestID' from 'RequestedRaffleWinner' event in our Raffle contract is the second event, or an event with index of 1.
          const requestId = txReceipt.events[1].args.requestId;
          const raffleState = await raffle.getRaffleState();

          assert(requestId.toNumber() > 0); // valid requestId
          assert(raffleState.toString() == '1'); // calculating state.
        });
      });
    });

/* 

yarn hardhat test --grep "updates the raffle state, emits an event, and calls the vrf coordinator"


 Raffle unit tests
    performUpkeep
      ✔ updates the raffle state, emits an event, and calls the vrf coordinator (339ms)


  1 passing (4s)

Done in 7.18s.

*/
