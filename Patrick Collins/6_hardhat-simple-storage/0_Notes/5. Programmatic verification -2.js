//* Programmatic verification -2

// This is 'deploy.js' file.

const { ethers, run } = require('hardhat'); //importing 'run' package. It allows us to run hardhat tasks. We will use this to run our 'verify' task.

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        'SimpleStorage'
    );

    console.log('Deploying the contract...');
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();

    console.log(`Deployed contract to: ${simpleStorage.address}`);
}

//* To auto verify contract
// It takes two arguments, the first one is the deployed contract address, and the second one is the constructor arguments of the contract, if contract has a constructor that is.
async function verify(contractAddress, args) {
    console.log('Verifying contract...');

    //using a 'try' and 'catch' block, in case our contract is already verfied or gets some other error.
    try {
        // Using the 'run' method. It takes two parameters, first is the task with a subtask, second is the actual parameters in an object  .
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes('already verified')) {
            //changing the error message to lowercase, and using 'includes' method to check if the error message consists of 'already verified' string.
            console.log('Already Verified!');
        } else {
            console.log(e); //logging the error.
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
 




*/
