//* 5. Depositing into AAVE- 1- LendingPoolAddresses

//* So now we'll create a function 'getLendingPool' to get the LendingPoolAddresses

//* This is 'aaveBorrow.js' file.

const { getWeth } = require('../scripts/getWeth.js');
const { getNamedAccounts } = require('hardhat');

async function main() {
    await getWeth();
    const { deployer } = await getNamedAccounts();

    // to interact with AAVE protocol, we need 'abi' and 'address' of its 'LendingPool' smart contract, whose addresses is indirectly provided to us by another contract named 'LendingPoolAddressesProvider'

    // LendingPoolAddressesProvider: 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
    // LendingPoolAddresses: ^

    // We will get the 'abi' from the interface 'ILendingPoolAddressesProvider' : https://docs.aave.com/developers/v/2.0/the-core-protocol/addresses-provider/ilendingpooladdressesprovider

    // add its solidity version to 'hardhat.config.js': { version: '0.6.12' }
}

//* To get the address of the Lending Pool smart contract.
async function getLendingPool(account) {
    // getting the contract and connecting to deployer, which will be passed to this funcition as 'account'.
    const lendingPoolAddressesProvider = await ethers.getContractAt(
        'ILendingPoolAddressesProvider',
        '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
        account
    );

    const lendingPoolAddress =
        await lendingPoolAddressesProvider.getLendingPool(); // calling the function on the provider contract which returns the address of the lending pool.

    //Getting the lending pool contract using the interface 'ILendingPool',passing the 'lendingPoolAddress' and connecting with deployer.
    // Add the interface 'ILendingPool' from : https://docs.aave.com/developers/v/2.0/the-core-protocol/lendingpool/ilendingpool, to the file 'ILendingPool in 'contracts/interfaces' folder.
    const lendingPool = await ethers.getContractAt(
        'ILendingPool',
        lendingPoolAddress,
        account
    );
    // As the 'ILendingPool.sol' uses some local imports from AAVE, we need to install:
    // yarn add --dev @aave/protocol-v2

    // Update these two in 'ILendingPool.sol' :
    /*
    
    import {ILendingPoolAddressesProvider} from "@aave/protocol-v2/contracts/interfaces/ILendingPoolAddressesProvider.sol";
    import {DataTypes} from "@aave/protocol-v2/contracts/protocol/libraries/types/DataTypes.sol";

    
    */

    return lendingPool; // return the address of lending pool.
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
