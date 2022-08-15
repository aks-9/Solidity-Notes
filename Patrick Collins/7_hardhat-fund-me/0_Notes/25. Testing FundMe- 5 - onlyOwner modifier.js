//* Testing FundMe- 5 - onlyOwner modifier

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
            // Arrange
            const accounts = await ethers.getSigners();
            for (i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                );
                await fundMeConnectedContract.fund({ value: sendValue });
            }

            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            );

            // Act
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

            // Assert
            assert.equal(endingFundMeBalance, 0);
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            );

            await expect(fundMe.funders(0)).to.be.reverted;
            for (i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.addressToAmountFunded(accounts[i].address),
                    0
                );
            }
        });

        it('Only the owner should be able to withdraw', async function () {
            const accounts = await ethers.getSigners();
            const attacker = accounts[1]; // using the second account as the 'attacker', as the first account is the 'deployer' account who is the owner as well. The 'attacker' account is not an owner, and hence should not be able to withdraw funds.

            const attackerConnectedContract = await fundMe.connect(attacker); //connecting the 'attacker' account to an instance of 'fundMe' contract.

            // await expect(attackerConnectedContract.withdraw()).to.be.reverted; // Trying to withdraw from 'attacker' account should give an error.

            //* A best practice is to name your custom errors by prefixing the contract name to them, so that when working with multiple contracts, in case an error arises, you would know from which contract the error is coming.

            // rename the custom error in the 'FundMe' contract to 'FundMe__NotOwner'.

            await expect(
                attackerConnectedContract.withdraw()
            ).to.be.revertedWith('FundMe__NotOwner'); // using custom error from our 'FundMe' contract.
        });
    });
});

// yarn hardhat test --grep owner

/*
  FundMe
    withdraw
      ✔ Only the owner should be able to withdraw (50ms)


  1 passing (939ms)

  
*/
