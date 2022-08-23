//* Raffle Unit tests- 1

// create a new folder 'test' in the root of the project, within it create another folder 'unit'. Inside 'unit' folder, create a new file 'Raffle.test.js'.

// This  is 'Raffle.test.js' file.

// imports
const { assert } = require('chai');
const { getNamedAccounts, deployments, ethers } = require('hardhat');
const {
  developmentChains,
  networkConfig,
} = require('../../helper-hardhat-config');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Raffle unit tests', function () {
      let raffle, vrfCoordinatorV2Mock;

      const chainId = network.config.chainId;

      beforeEach(async function () {
        const { deployer } = await getNamedAccounts();
        await deployments.fixture(['all']);

        raffle = await ethers.getContract('Raffle', deployer);
        vrfCoordinatorV2Mock = await ethers.getContract(
          'VRFCoordinatorV2Mock',
          deployer
        );
      });

      describe('constructor', function () {
        it('Initializes the Raffle correctly', async function () {
          // Ideally we make our tests have just 1 assert per 'it'

          const raffleState = await raffle.getRaffleState();

          // Even though we have an 'enum' for RaffleState', it will return '0' when it's in 'open' state, and '1' when it's in 'calculating' state. As 'enum' is technically just a 'uint'

          assert.equal(raffleState.toString(), '0'); // we want the raffle to be in 'open' state. So it must return '0'.

          // The interval between the Raffle should be equal to what we've defined in our 'helper-hardhat-config' file.
          const interval = await raffle.getInterval();
          assert.equal(interval.toString(), networkConfig[chainId]['interval']);
        });
      });
    });
