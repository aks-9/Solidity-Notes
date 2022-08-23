//* Raffle Unit tests- 11

// This  is 'Raffle.test.js' file.

//* Massive Promise Test

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

          const requestId = txReceipt.events[1].args.requestId;
          const raffleState = await raffle.getRaffleState();

          assert(requestId.toNumber() > 0); // valid requestId
          assert(raffleState.toString() == '1'); // calculating state.
        });
      });

      describe('fulfillRandomWords', function () {
        beforeEach(async function () {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
          await network.provider.request({ method: 'evm_mine', params: [] });
        });

        it('can only be called after performUpkeep', async () => {
          expect(
            vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)
          ).to.be.revertedWith('nonexistent request');
          expect(
            vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address)
          ).to.be.revertedWith('nonexistent request');
        });

        it('picks a winner, resets, and sends money', async () => {
          const additionalEntrants = 3; //additional people entering the lottery
          const startingAccountIndex = 1; // since index of deployer = 0
          const accounts = await ethers.getSigners(); // getting the accounts.

          // to connect these new accounts to our raffle contract , we'll use a for loop.
          for (
            let i = startingAccountIndex;
            i < startingAccountIndex + additionalEntrants;
            i++
          ) {
            const accountConnectedRaffle = raffle.connect(accounts[i]); // Returns a new instance of the Raffle contract connected to player
            await accountConnectedRaffle.enterRaffle({
              value: raffleEntranceFee,
            }); // accounts entering the raffle.
          }

          // so now we've a total of 4 people connected to our raffle. One deployer, and three new accounts.

          const startingTimeStamp = await raffle.getLastTimeStamp(); // stores starting timestamp (before we fire our event)

          // performUpkeep (mock being Chainlink keepers)
          // fulfillRandomWords ( mock being Chainlink VRF)
          // if we're on a testnet, We'll have to wait for 'fulfillRandomWords' to be called by VRF. But since we're on hardhat network, we don't have to wait.

          // We're going to simulate that we DO need to wait for that event 'WinnerPicked'. So we will set up a 'listner'. Now if we set up a 'listner', we don't want this test to finish before the 'listener' is done listening, so we've to create a new 'promise'. This is going to be very important for our staging tests.

          await new Promise(async (resolve, reject) => {
            //When event 'WinnerPicked' happens, then arrow function will kick off, where we'll have our 'asserts'.
            raffle.once('WinnerPicked', async () => {
              try {
                resolve(); // if timeout doesn't happen
              } catch (e) {
                reject(e);
              }
            });

            /* 
            
            Now before the event 'WinnerPicked' gets fired, we need to call 'performUpkeep' and 'fulfillRandomWords'. This might seems a little bit backwards, but it's because we want to set up our listner, so that when we do call the methods that will fire the event, our 'listener' is activated and waiting for it.

            So we're going to put all of our code inside this 'Promise' now, because if we put it outside, then this 'Promise' will never get resolved, because the listner will never fire its event. So we need to  add all of our code inside this 'Promise' but outside the 'raffle.once()'

            As we don't want to wait forever, we need to add a timeout in our 'hardhat.config.js'
            
            mocha:{
              timeout: 300000 // 300 seconds
            } 

            If this 'WinnerPicked' event doesn't get fired within 300 seconds, then this test will fail. So we'll wrap it in a 'try' and 'catch' block.
            
            */
          });
        });
      });
    });

/* 

yarn hardhat test --grep ""





*/
