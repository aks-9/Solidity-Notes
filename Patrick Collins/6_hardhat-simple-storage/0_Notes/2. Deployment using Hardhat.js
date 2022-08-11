//* Deployment using Hardhat
// This is 'deploy.js' file.

const { ethers } = require('hardhat'); // We're importing the 'ethers' from 'hardhat' instead of 'ethers'.  'hardhat-ethers' a package that wraps the 'hardhat' with its own built-in 'ethers'. It allows us to keep track of all the contracts and deployments in hardhat network.

//function
async function main() {
    //* As we're importing 'ethers' from 'hardhat' directly, we don't have to create a provider, a wallet, read ABI and Binary. All of this is done in background by Hardhat. We can directly go and create a contractFactory of a particular contract.

    const SimpleStorageFactory = await ethers.getContractFactory(
        'SimpleStorage'
    ); // using 'getContractFactory' to get the contract.

    console.log('Deploying the contract...');
    const simpleStorage = await SimpleStorageFactory.deploy(); //deploying
    await simpleStorage.deployed(); // waiting for contract deployment.

    console.log(`Deployed contract to: ${simpleStorage.address}`);
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

/*
 Run this script:

 yarn hardhat run scripts/deploy.js


Deploying the contract...
Deployed contract to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Done in 3.63s.

*/
