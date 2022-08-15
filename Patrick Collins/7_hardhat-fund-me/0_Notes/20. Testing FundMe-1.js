//* Testing FundMe- 1

// Delete the sample test file in the 'test' folder, and create 2 new folders under the 'test' folder. The first one is 'unit' and second one is 'staging'.

// UNIT- testing minimal portion of the code.
// can be done on a local hardhat network
// or on a forked hardhat network

// STAGING / INTEGRATION - On the test net. Just before deploying on the main net.

//* This is './test/unit/FundMe.test.js' file.

const { deployments, ethers, getNamedAccounts } = require('hardhat'); //importing the 'deployments', 'ethers', and 'getNamedAccounts' objects.
const { assert } = require('chai'); //For comparision.

// Writing tests will be based around different functions.

describe('FundMe', function () {
    // VARIABLES
    let fundMe;
    let deployer;
    let mockV3Aggregator;

    beforeEach(async function () {
        //* Deploying the contract for testing, using hardhat-deploy.

        // const { deployer } = await getNamedAccounts(); // getting the deployer account.
        deployer = (await getNamedAccounts()).deployer; // This is same as the line above. We're taking the 'deployer' object from 'getNamedAccounts' and assigning it to the 'deployer' variable, as we have to use 'deployer' variable in the test.

        /*
        Another way you can get a list of accounts from your 'hardhat-config.js' is by using a 'signers' function.

        const accounts = await ethers.getSigners(); // This will give the accounts available on the hardhat network.

        Then you can assign which account that you want to use.
        const accountZero = accounts[0]; // Assigning the first account to 'accountZero'

        */

        await deployments.fixture(['all']); // using 'fixture' method on the 'deployments' object we can run our 'deploy' folder with as many tags as we want. So when we pass ['all'] tag, on the local network, it will run all the scripts in the 'deploy' folder.

        //* This allow us to create deployments of multiple contracts in one go, and then we can create an instance of the deployed contract, attach it with a 'deployer' account, and call functions on it in the 'it' blocks. As opposed to using a 'getContractFactory' to create a 'contractFactory' of each contract, and then calling '.deploy' on each of them in the previous lessons.

        // CREATING CONTRACT INSTANCES.
        fundMe = await ethers.getContract('FundMe', deployer); // getting the most recent deployment of the 'FundMe' contract on the local hardhat network using the 'getContract' function. And connecting 'deployer' account to our 'FundMe' contract. Any function called on 'fundMe' will be from this 'deployer' account now.

        mockV3Aggregator = await ethers.getContract(
            'MockV3Aggregator',
            deployer
        ); // Getting the 'MockV3Aggregator' contract
    });

    describe('constructor', function () {
        it('Sets the aggregator address correctly', async function () {
            const response = await fundMe.priceFeed(); // Calling the 'priceFeed' public function on the 'fundMe' contract. This needs to be the same as our 'mockV3Aggregator' address.

            assert.equal(response, mockV3Aggregator.address); //comparing
        });
    });
});

// yarn hardhat test

/*
  FundMe       
    constructor
      ✔ Sets the owner and the aggregator address correctly (40ms)


  1 passing (2s)

Done in 3.31s.

*/
