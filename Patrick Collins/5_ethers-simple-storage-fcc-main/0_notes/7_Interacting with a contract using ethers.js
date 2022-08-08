//* Interacting with a contract using ethers.js

const ethers = require('ethers');
const fs = require('fs-extra');
async function main() {
    const provider = new ethers.providers.JsonRpcProvider(
        'HTTP://127.0.0.1:7545'
    );
    const wallet = new ethers.Wallet(
        'aac6dbc0f07958ff75ed6330dc16c71298a35bd8e8204dadba79a7f394ad2afd',
        provider
    );
    const abi = fs.readFileSync(
        './SimpleStorage_sol_SimpleStorage.abi',
        'utf8'
    );
    const binary = fs.readFileSync(
        './SimpleStorage_sol_SimpleStorage.bin',
        'utf8'
    );
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log('Deploying, please wait...');
    const contract = await contractFactory.deploy();

    // console.log(
    //     'Here is the transaction response:\n',
    //     contract.deployTransaction
    // );

    await contract.deployTransaction.wait(1);
    // console.log('Here is the tranasaction receipt:\n', transactionReceipt);

    //* Getting favourite number from contract by calling the 'retrieve' function.
    const currentFavouriteNumeber = await contract.retrieve();
    // console.log(currentFavouriteNumeber);

    /* 
    it returns a number in BigNumber format- BigNumber { _hex: '0x00', _isBigNumber: true }

    ==> BigNumber is a library that comes with the 'ethers' that helps us work with numbers.

    Solidity can't use decimal places, and JavaScript has a hard time with decimal places. So JavaScript uses strings instead of numbers. Or we can use BigNumbers.

    We can use .toString() to convert the BigNumber into a string that JavaScript understands.
    
    */
    console.log(currentFavouriteNumeber.toString()); //converting to string.
    console.log(
        `Current favorite number is: ${currentFavouriteNumeber.toString()}`
    ); //using string interpolation of ES6

    const transactionResponse = await contract.store('7'); //Passing the number 7 as a string.
    const transactionReceipt = await transactionResponse.wait(1); //Waiting 1 block for confirmation.

    const updatedFavoriteNumber = await contract.retrieve(); //checking if our number is updated in contract.
    console.log(`Updated favorite number is: ${updatedFavoriteNumber}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// Run node deploy.js to deploy the contract.

/*
0
Current favorite number is: 0
Updated favorite number is: 7

*/
