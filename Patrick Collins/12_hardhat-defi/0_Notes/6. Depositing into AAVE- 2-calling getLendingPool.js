//* 6. Depositing into AAVE- 2-calling getLendingPool

//* This is 'aaveBorrow.js' file.

//* So now we'll call the function 'getLendingPool' to get the address of lending pool.

const { getWeth } = require('../scripts/getWeth.js');
const { getNamedAccounts } = require('hardhat');

async function main() {
    await getWeth();
    const { deployer } = await getNamedAccounts();

    const lendingPool = await getLendingPool(deployer); // calling our function to get the address of lending pool.

    console.log(`Lending pool address is : ${lendingPool.address}`); // adding
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

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

/*

yarn hardhat run scripts/aaveBorrow.js


! This will give us error: HardhatError: HH701: There are multiple artifacts for contract "ILendingPoolAddressesProvider", please use a fully qualified name.

* We have to delete 'ILendingPoolAddressesProvider.sol' as we have it in our node modules now.

yarn hardhat run scripts/aaveBorrow.js

OUTPUT: 



Got 20000000000000000 WETH
Lending pool address is : 0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9
Done in 11.65s.

* This is actual lending pool address on the mainnet Ethereum
 */
