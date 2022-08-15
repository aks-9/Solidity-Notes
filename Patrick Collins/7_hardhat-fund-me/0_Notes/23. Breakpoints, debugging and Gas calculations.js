//* Breakpoints, debugging and Gas calculations

// This is './test/unit/FundMe.test.js' file.

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
            const response = await fundMe.priceFeed();
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
            const response = await fundMe.addressToAmountFunded(deployer);
            assert.equal(response.toString(), sendValue.toString());
        });

        it('Adds funder to array of funders', async function () {
            await fundMe.fund({ value: sendValue });
            const funder = await fundMe.funders(0);
            assert.equal(funder, deployer);
        });
    });

    describe('withdraw', function () {
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue });
        });

        it('withdraw ETH from a single founder', async function () {
            // Arrange
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            );

            // Act
            const transactionResponse = await fundMe.withdraw();
            const transactionReceipt = await transactionResponse.wait(1);

            //! Adding a breakpoint at this line by clicking a 'red' dot next to the line number, allow us to go to debug console and see all the values of the variables at that point in time.
            // Click on 'Run and Debug' from the Left menu of VS code. Then click on 'JavaScript Debug Terminal'. Now if we run our tests in this new terminal, our execution will stop at the breakpoint and then we can see all the variables.

            // Now if you go to the "Debug Console" and type, 'transactionReceipt', it will show you all the details of that object.

            // You will notice that there is an 'gasUsed' and an 'effectiveGasPrice' object. Both are in Big Number.

            //* GAS CALCULATIONS
            const { gasUsed, effectiveGasPrice } = transactionReceipt; // getting the 'gasUsed' and 'effectiveGasPrice' from 'transactionReceipt'.
            const gasCost = gasUsed.mul(effectiveGasPrice); // calculating total gas cost in this transaction. Using '.mul' function for multiplication as 'gasUsed' and 'effectiveGasPrice' are Big Numbers.

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            );

            //Assert
            assert.equal(endingFundMeBalance, 0);
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            ); // adding 'gasConst' as deployer has spent some 'gas' while withdrawing.
        });
    });
});

// yarn hardhat test --grep withdraw

/*

 FundMe
    withdraw
      ✔ withdraw ETH from a single founder (81ms)


  1 passing (1s)
  
*/
