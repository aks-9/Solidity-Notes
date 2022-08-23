//* Raffle Unit tests- 2

// This  is 'Raffle.test.js' file.

const { assert, expect } = require('chai'); // import 'expect'
const { getNamedAccounts, deployments, ethers } = require('hardhat');
const {
  developmentChains,
  networkConfig,
} = require('../../helper-hardhat-config');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Raffle unit tests', async function () {
      let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer; //adding
      const chainId = network.config.chainId;

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer; //refactoring
        await deployments.fixture(['all']);
        raffle = await ethers.getContract('Raffle', deployer);
        vrfCoordinatorV2Mock = await ethers.getContract(
          'VRFCoordinatorV2Mock',
          deployer
        );
        raffleEntranceFee = await raffle.getEntranceFee(); //adding
      });

      describe('constructor', function () {
        it('Initializes the Raffle correctly', async function () {
          const raffleState = await raffle.getRaffleState();
          const interval = await raffle.getInterval();
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
          await raffle.enterRaffle({ value: raffleEntranceFee }); //entering the raffle

          //Since we're currently connected with 'deployer' account, we need to make sure that it is recorded in the contract.
          const playerFromContract = await raffle.getPlayer('0');
          assert.equal(playerFromContract, deployer);
        });
      });
    });
/*

Add the following in the 'hardhat.config.js' file:

gasReporter: {
    enabled: false,
    currency: 'USD',
    outputFile: 'gas-report.txt',
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },

-----------------------------------------------------------------------------
yarn hardhat test

OUTPUT:

  Raffle unit tests
    constructor    
      ✔ Initializes the Raffle correctly
    enter raffle
      ✔ reverts if you do not pay enough (72ms)
      ✔ records players when they enter raffle (44ms)


  3 passing (3s)

Done in 5.28s.
*/
