//* 8. Borrowing from AAVE- 1

//* This is 'aaveBorrow.js' file.

//* BORROW TIME
// But before we can borrow we need to know:
// How much we have collatral?
// HOw much we can borrow?
// How much we have already borrowed?

// AAVE contract comes with 'getUserAccountData' function, which returns user's account data across all reserves.
//https://docs.aave.com/developers/v/2.0/the-core-protocol/lendingpool

//* Loan to Value:
// The percentage you can borrow against your collateral. If we have 1 ETH then you can only borrow 0.75 DAI tokens.

//* Liquadation:
// When your liquadation threshold is reached, AAVE sells your collatral to somebody else at a discount to recover the loan you took in order to sustain the protocol financially, that is to remain 'solvent'.

//* Liquadation Threshold:
// If we have 1 ETH deposited, and 0.81 ETH borrowed, then you will get liquadated if Liquadatin Threshold is 80%.

//* Health Factor:
// If it goes below 1, you get liquadated.

//* So now we'll create a function 'getBorrowUserData' to get all data of a user that has borrowed from AAVE.

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

    //* Getting your borrowing stats
    let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(
        lendingPool,
        deployer
    );
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

// * To return user's account data across all reserves.
async function getBorrowUserData(lendingPool, account) {
    //getting data by calling 'getUserAccountData' function.
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(account);

    console.log(`You have ${totalCollateralETH} worth of ETH deposited.`); //logging
    console.log(`You have ${totalDebtETH} worth of ETH borrowed.`); //logging
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH.`); //logging

    return { availableBorrowsETH, totalDebtETH }; //returning

    //* now we'll call this function from our 'main' function.
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

Got 20000000000000000 WETH
Lending pool address is : 0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9
Approved!
Depositing WETH...
Desposited!
You have 20000000000000000 worth of ETH deposited.
You have 0 worth of ETH borrowed.
You can borrow 16500000000000000 worth of ETH. 
Done in 27.77s.

* amount borrowed must always be less than the amount you have deposited 


*/
