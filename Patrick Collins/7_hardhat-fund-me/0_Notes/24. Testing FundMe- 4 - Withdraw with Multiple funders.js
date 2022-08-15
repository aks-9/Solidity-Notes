//* Testing FundMe- 4 - Withdraw with Multiple funders

// This is './test/unit/FundMe.js' file.

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

        it('withdraw ETH from a single funder', async function () {
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

            // GAS CALCULATIONS
            const { gasUsed, effectiveGasPrice } = transactionReceipt;
            const gasCost = gasUsed.mul(effectiveGasPrice);

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
            );
        });

        it('withdraw ETH when we have multiple funders', async function () {
            //* Arrange
            const accounts = await ethers.getSigners(); // getting accounts from local hardhat network.

            // Using a 'for' loop to go through 5 accounts, one by one. Here 'i' = 0 is the deployer account, so we will start from 'i' = 1.
            for (i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                ); // connecting all the 'accounts' to the 'fundMe' contract instance using the 'connect' function. Before this, the 'fundMe' contract was connected to the 'deployer' account.

                await fundMeConnectedContract.fund({ value: sendValue }); // funding the contract with each account.
            }

            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            );

            //* Act
            const transactionResponse = await fundMe.withdraw();
            const transactionReceipt = await transactionResponse.wait(1);
            const { gasUsed, effectiveGasPrice } = transactionReceipt;
            const gasCost = gasUsed.mul(effectiveGasPrice);

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            );

            //* Assert
            assert.equal(endingFundMeBalance, 0);
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            );

            // Making sure that funders array is reset.
            await expect(fundMe.funders(0)).to.be.reverted; // The zeroth index of the 'funders' array should give an error, so it should be reverted.

            // looping through accounts and checking if 'addressToAmountFunded' mapping has been set to 0.
            for (i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.addressToAmountFunded(accounts[i].address),
                    0
                );
            }
        });
    });
});

// yarn hardhat test --grep multiple

/*

  FundMe
    withdraw
      ✔ withdraw ETH when we have multiple funders (424ms)


  1 passing (1s)

Done in 3.78s.

  
*/
