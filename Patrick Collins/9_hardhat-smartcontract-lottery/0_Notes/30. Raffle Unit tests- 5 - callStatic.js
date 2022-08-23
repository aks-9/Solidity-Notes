//* Raffle Unit tests- 5 - callStatic

// This  is 'Raffle.test.js' file.

//* Test cases for 'checkUpKeep' using 'callStatic'

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

      describe('checkUpKeep', function () {
        it('returns false if people have not sent any ETH', async function () {
          // As we know, for 'checkUpKeep' we have to pass the time interval using Harhat methods.
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
          await network.provider.request({ method: 'evm_mine', params: [] });

          /*
          Now we can call 'checkUpKeep', which is a public function, if we simply call it like this:

          await raffle.checkUpKeep();
          
          it will kick off a transaction. But we don't want to send a transaction, we simply want to simulate a transaction, and see what 'upkeepNeeded' would return. We can achieve this using 'callStatic'. We can simulate calling this transaction to see what would it respond.
          */
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]); //extracting 'upkeepNeeded' from simulating a trasaction by passing an empty array to 'checkUpKeep' function. It should return 'false' as no ETH has been sent.

          assert(!upkeepNeeded); // This will return 'true' as 'upkeepNeeded' is 'false', so our test will pass.
        });
      });
    });

/* 

yarn hardhat test --grep ETH

  Raffle unit tests
    checkUpKeep
      ✔ returns false if people have not sent any ETH (53ms)


  1 passing (4s)

Done in 6.87s.


*/
