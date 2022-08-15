//* Testing FundMe- 3

// This is './test/unit/FundMe.test.js' file.

//* Withdraw function and Gas calculations.

const { deployments, ethers, getNamedAccounts } = require('hardhat');
const { assert, expect } = require('chai');

describe('FundMe', function () {
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    const sendValue = ethers.utils.parseEther('1');

    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(['all']);

        fundMe = await ethers.getContract('FundMe', deployer);
        mockV3Aggregator = await ethers.getContract(
            'MockV3Aggregator',
            deployer
        );
    });

    describe('constructor', function () {
        it('Sets the aggregator address correctly', async function () {
            const response = await fundMe.getPriceFeed();
            assert.equal(response, mockV3Aggregator.address);
        });
    });

    describe('fund', function () {
        it('Fails if you do not send enough ETH', async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                'You need to spend more ETH'
            );
        });

        it('Updates the amount funded in the data structure', async function () {
            await fundMe.fund({ value: sendValue });
            const response = await fundMe.getAddressToAmountFunded(deployer);
            assert.equal(response.toString(), sendValue.toString());
        });

        it('Adds funder to array of funders', async function () {
            await fundMe.fund({ value: sendValue });
            const funder = await fundMe.getFunder(0);
            assert.equal(funder, deployer);
        });
    });

    describe('withdraw', function () {
        // Before we can withdraw funds from the contract using the 'withdraw' function, the contract needs to have some funds. So first we'll fund the contract.
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue });
        });

        it('withdraw ETH from a single funder', async function () {
            //* Arrange
            // Getting the starting balance of the contract using 'provider'. We can also use 'ethers' instead of 'FundMe'.
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            ); // This will be a Big Number.

            // Getting the starting balance of the deployer account using 'provider'.
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            );

            //* Act
            const transactionResponse = await fundMe.withdraw(); //withdrawing
            const transactionReceipt = await transactionResponse.wait(1); //waiting for confirmation.

            // Now the contract should have zero balance and the 'deployer' should have all the funds.
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            );

            //* Assert
            assert.equal(endingFundMeBalance, 0); // contract balance should be 0.

            // Since 'startingFundMeBalance' is a big number, we'll use '.add()' instead of '+' to do the addition.
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance
            );
        });
    });
});

// yarn hardhat test --grep

/*
 
! This will give an error as we have not considered gas cost while performing withdrawal.

*/
