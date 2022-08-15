//* Testing FundMe- 2

// This is './test/unit/FundMe.test.js' file.

//* Using Waffle, and 'expect' keyword instead of 'assert'.

const { deployments, ethers, getNamedAccounts } = require('hardhat');
const { assert, expect } = require('chai'); // importing 'expect'

describe('FundMe', function () {
    // VARIABLES
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    // const sendValue = '1000000000000000000'; // 1 eth
    const sendValue = ethers.utils.parseEther('1'); // more readable form, this is also 1 eth.

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
            ); // We're not sending at least 'MINIMUM_USD' with this transaction, so this transaction will fail. But we can't use 'assert' to verify if something fails, so we'll use Waffle here and use 'expect' keyword instead of 'assert'. You can specify the error message string in the 'revertedWith' function.
        });

        it('Updates the amount funded in the data structure', async function () {
            await fundMe.fund({ value: sendValue }); // need to send some value with this transaction so that we'll update our 'addressToAmountFunded' mapping. This will definitly be more than our 'MINIMUM_USD' value of $50.

            const response = await fundMe.addressToAmountFunded(deployer); // getting the amount we've sent, from 'addressToAmountFunded' mapping at 'deployer' account. This will be a Big Number. Notice we're using '()' instead of '[]' for mapping.

            assert.equal(response.toString(), sendValue.toString()); //comparing their string values, as they both are Big Numbers.
        });

        it('Adds funder to array of funders', async function () {
            await fundMe.fund({ value: sendValue }); //sending some value using 'deployer' account.
            const funder = await fundMe.funders(0); // calling the 'funders' array at index '0', as this is the first 'funder'. Again we're using '()' instead of '[]' for an array.

            assert.equal(funder, deployer); //comparing. Because 'deployer' is the one who has become the first 'funder'.
        });
    });
});

// yarn hardhat test --grep

/*


*/
