//* 9. Borrowing from AAVE- 2

//* This is 'aaveBorrow.js' file.

//* availableBorrowsETH ? what is the conversion rate of DAI?
// How much DAI can we borrow against the ETH that is available for us to borrow.
// We will use Chainlink price feeds to get the conversion rate.

// Add 'AggregatorV3Interface.sol' file in the 'contracts/interfaces' folder.
// Copy and paste the code for 'AggregatorV3Interface' in to the new file either from https://github.com/PatrickAlphaC/hardhat-defi-fcc/blob/main/contracts/interfaces/AggregatorV3Interface.sol  or you can install npm package of Chainlink and import from it.

//* So now we'll create a function 'getDaiPrice' to get the conversion rate of DAI.

const { getWeth, AMOUNT } = require('../scripts/getWeth.js');
const { getNamedAccounts } = require('hardhat');

async function main() {
    await getWeth();
    const { deployer } = await getNamedAccounts();
    const lendingPool = await getLendingPool(deployer);
    console.log(`Lending pool address is : ${lendingPool.address}`);

    const wethTokenAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer);
    console.log('Depositing WETH...');

    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
    console.log('Desposited!');

    let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(
        lendingPool,
        deployer
    );

    const daiPrice = await getDaiPrice(); // calling to get the conversion rate of DAI  against ETH.
}

async function getLendingPool(account) {
    const lendingPoolAddressesProvider = await ethers.getContractAt(
        'ILendingPoolAddressesProvider',
        '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
        account
    );

    const lendingPoolAddress =
        await lendingPoolAddressesProvider.getLendingPool();
    const lendingPool = await ethers.getContractAt(
        'ILendingPool',
        lendingPoolAddress,
        account
    );

    return lendingPool;
}

async function approveErc20(
    erc20Address,
    spenderAddress,
    amountToSpend,
    account
) {
    const erc20Token = await ethers.getContractAt(
        'IERC20',
        erc20Address,
        account
    );

    const tx = await erc20Token.approve(spenderAddress, amountToSpend);
    await tx.wait(1);
    console.log('Approved!');
}

async function getBorrowUserData(lendingPool, account) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(account);

    console.log(`You have ${totalCollateralETH} worth of ETH deposited.`);
    console.log(`You have ${totalDebtETH} worth of ETH borrowed.`);
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH.`);

    return { availableBorrowsETH, totalDebtETH };
}

//* to get the conversion rate of DAI
async function getDaiPrice() {
    // get the DAI / ETH price feed on mainnet from Chainlink docs: https://docs.chain.link/docs/ethereum-addresses/
    // 0x773616E4d11A78F511299002da57A0a94577F1f4
    const daiEthPriceFeed = await ethers.getContractAt(
        'AggregatorV3Interface',
        '0x773616E4d11A78F511299002da57A0a94577F1f4'
    ); // we don't need to connect to deployer account as we're not sending any transactions. We're just going to read from this contract.

    const price = (await daiEthPriceFeed.latestRoundData())[1]; // calling the 'latestRoundData' function on 'AggregatorV3Interface'.

    /*
    This 'latestRoundData' function returns:

    uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound

    * We only need the second value i.e. 'answer' which has the 'price' value. So we'll wrap the whole function in () and add the index of the 'answer' parameter, which is [1].

    */

    console.log(`The DAI/ETH price is ${price.toString()}`); // logging

    return price;

    // Now we'll call this from our 'main' function.
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

/*
yarn hardhat run scripts/aaveBorrow.js

* OUTPUT:

Compiled 1 Solidity file successfully
Got 20000000000000000 WETH
Lending pool address is : 0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9
Approved!
Depositing WETH...
Desposited!
You have 20000000000000000 worth of ETH deposited.
You have 0 worth of ETH borrowed.
You can borrow 16500000000000000 worth of ETH.
The DAI/ETH price is 686484598873080
Done in 28.51s.




*/
