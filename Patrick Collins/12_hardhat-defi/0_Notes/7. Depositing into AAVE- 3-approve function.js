//* 7. Depositing into AAVE- 3-approve function

//
//* So now we'll be creating an 'approve' function before depositing.

//* This is 'aaveBorrow.js' file.

const { getWeth, AMOUNT } = require('../scripts/getWeth.js'); //importing 'AMOUNT'
const { getNamedAccounts } = require('hardhat');

async function main() {
    await getWeth();
    const { deployer } = await getNamedAccounts();
    const lendingPool = await getLendingPool(deployer);
    console.log(`Lending pool address is : ${lendingPool.address}`);

    //* DEPOSIT!
    /*
    In the deposit function from AAVE Github, we see that it calls 'safeTransferFrom' function. This means the 'LendingPool' contract of AAVE will pull money from our wallet, and to do that we must 'approve' it beforehand.

    * So before we can deposit, we need to approve it to get our WETH token.  
    
    */
    const wethTokenAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'; // getting our WETH token.

    await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer); // approving the AAVE contract to pull WETH tokens from the deployer account.
    console.log('Depositing WETH...');

    /*
    The deposit function from AAVE Github has these parameters:

    function deposit(
     address asset,
     uint256 amount,
     address onBehalfOf,
     uint16 referralCode
    )
    
    */
    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0); // calling to deposit. 'referralCode' is always '0' now, as it has been discontinued.
    console.log('Desposited!');
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

//* creating an 'approve' function.
// create a new file in 'contracts/interfaces/IERC20.sol' and add the interface in it from: https://github.com/PatrickAlphaC/hardhat-defi-fcc/blob/main/contracts/interfaces/IERC20.sol
async function approveErc20(
    erc20Address, //  WETH contract address
    spenderAddress, //the address of the AAVE Lending pool contract that wants to pull WETH from our account.
    amountToSpend, // amount
    account // our account from which WETH will be taken.
) {
    const erc20Token = await ethers.getContractAt(
        'IERC20', //interface for ERC20 token
        erc20Address,
        account
    );

    const tx = await erc20Token.approve(spenderAddress, amountToSpend); // approving
    await tx.wait(1);

    console.log('Approved!');

    //! We must run this function before we 'deposit', otherwise we'll get an error 'Token is not approved'.
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
Done in 31.29s.

*/
