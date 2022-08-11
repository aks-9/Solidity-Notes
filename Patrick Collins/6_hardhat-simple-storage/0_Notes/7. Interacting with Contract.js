//* Interacting with Contract

// This is 'deploy.js' file.

const { ethers, run, network } = require('hardhat');

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        'SimpleStorage'
    );

    console.log('Deploying the contract...');
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();

    console.log(`Deployed contract to: ${simpleStorage.address}`);

    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        console.log('Waiting for block confirmations...');

        await simpleStorage.deployTransaction.wait(6);
        await verify(simpleStorage.address, []);
    }

    //* Interacting with Contract
    const currentValue = await simpleStorage.retrieve(); // getting current value
    console.log(`Current Value is: ${currentValue}`);

    // Update the current value
    const transactionResponse = await simpleStorage.store(7); // calling 'store' function of our contract to store a new value of '7'.

    await transactionResponse.wait(1); // waiting for 1 block confirmation.

    const updatedValue = await simpleStorage.retrieve(); //fetching the new value.
    console.log(`Updated Value is: ${updatedValue}`);
}

//* To auto verify contract
async function verify(contractAddress, args) {
    console.log('Verifying contract...');

    try {
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes('already verified')) {
            console.log('Already Verified!');
        } else {
            console.log(e);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

/*
 Run this script:

 yarn hardhat run scripts/deploy.js

 yarn run v1.22.19
$ "D:\Work\Solidity Basics\Patrick Collins\6\node_modules\.bin\hardhat" run scripts/deploy.js
Deploying the contract...
Deployed contract to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Current Value is: 0
Updated Value is: 7
Done in 5.32s.


To deploy on Rinkeby
yarn hardhat run scripts/deploy.js --network rinkeby

yarn run v1.22.19
$ "D:\Work\Solidity Basics\Patrick Collins\6\node_modules\.bin\hardhat" run scripts/deploy.js --network rinkeby
Deploying the contract...
Deployed contract to: 0x98FD564AD0D536C9f8a977C7BD6Fd2C64C55E5FE
Current Value is: 0
Updated Value is: 7
Done in 47.33s.

*/
