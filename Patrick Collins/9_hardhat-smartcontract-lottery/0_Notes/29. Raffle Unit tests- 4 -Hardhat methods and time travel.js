//* Raffle Unit tests- 4

// This  is 'Raffle.test.js' file.

//* Hardhat methods and time travel

const { assert, expect } = require('chai'); // import 'expect'
const { getNamedAccounts, deployments, ethers, network } = require('hardhat'); //importing 'network'
const {
  developmentChains,
  networkConfig,
} = require('../../helper-hardhat-config');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Raffle unit tests', async function () {
      let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, interval; //adding 'interval'

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

        interval = await raffle.getInterval(); //adding globally
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
          /* 
          
          At the start, raffle is in the 'Open' state. We want the raffle into a 'calculating' state. 
          
          In 'performUpKeep' function we changed the state from 'open' to 'calculating'. But 'performUpKeep' function can only be called when 'checkUpKeep' function returns 'upKeepNeeded' as 'true'. 
          
          Otherwise it will revert with 'Raffle__upKeepNotNeeded'.
          
          So we need to make 'checkUpKeep' function return 'true', and once we get it 'true', then we'll call 'performUpKeep' function to put Raffle contract in the 'calculating' state.  

          For 'checkUpKeep' to be 'true', we need 'upkeepNeeded' to be 'true'.
          
          //* upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers);

          ==> 'upkeepNeeded' will only be true, when raffle is in 'open' state, has at least one player, has some balance in the contract, and a predefined time interval has passed.

          */

          await raffle.enterRaffle({ value: raffleEntranceFee }); // Entering the raffle as it is already in OPEN state at the start, and so now it has a player and some funds in the contract. So 3 out of 4 conditions are met for 'upkeepNeeded' to return 'true'.

          /*          
          Now we need to pass the time between two raffles. Only when the time passsed is greater than the 'interval' set by contract, can we proceed further.

          But if the interval is large, we can't wait for it to pass in our testing. So we use two special Hardhat methods to manipulate, and speed up the blockchain in terms of time. These methods are 'evm_increaseTime' and 'evm_mine'.

          'evm_increaseTime' increases the time of our blockchain, and 'evm_mine' mines new blocks.

          For a documentation of the Hardhat methods below, go here: https://hardhat.org/hardhat-network/reference

          */

          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]); // Increasing time of blockchain and passing 'interval' as parameter. This will increase the time by that interval.

          await network.provider.request({ method: 'evm_mine', params: [] }); // mining the blocks along with time. Passing an empty array as a parameter as we just want to mine a new block to move the blockchain forward.

          //* 'checkUpKeep' function should now return 'true'.

          // we pretend to be a keeper for a second and call 'performUpkeep' function.
          await raffle.performUpkeep([]); // changes the state to 'calculating' for our comparison below. Passing an empty calldata by passing an empty array.

          //* NOW RAFFLE SHOULD BE IN 'CALCULATING' STATE.

          // Now if we try to enter the raffle, it should give us an error.
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee })
          ).to.be.revertedWith('Raffle__RaffleNotOpen'); //checking for error.
        });
      });
    });

/*

yarn hardhat test --grep calculating

OUTPUT:

! THIS WILL GIVE AN ERROR.

  Raffle unit tests
    enter raffle
      1) does not allow entering when raffle is calculating


  0 passing (3s)
  1 failing

  1) Raffle unit tests
       enter raffle
         does not allow entering when raffle is calculating:
     Error: VM Exception while processing transaction: reverted with custom error 'InvalidConsumer()'
-------------------------------------------------------------------------

As the tutorial used @chainlink/contracts@0.4.1, all those using a newer versions will get an error.

Install the tutorial version to resolve this error:

npm install --save-dev @chainlink/contracts@0.4.1 

Reference: https://github.com/smartcontractkit/full-blockchain-solidity-course-js/discussions/1565


--------------------------------------------------------------------

yarn hardhat test --grep calculating

OUTPUT:
Raffle unit tests
    enter raffle
      ✔ does not allow entering when raffle is calculating (153ms)


  1 passing (15s)



*/
