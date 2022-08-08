//* Transaction response and transaction receipt.

const ethers = require('ethers');
const fs = require('fs-extra');

async function main() {
    //* Creating a provider.
    const provider = new ethers.providers.JsonRpcProvider(
        'HTTP://127.0.0.1:7545'
    );
    // Make sure the Ganache is running in the background.

    //* Creating a Wallet.
    const wallet = new ethers.Wallet(
        'e8a3b0a970e220ca8c8e60773f209d57258ea54347eadf5b0e2f6da01487321d', //this address needs to be updated everytime we restart Ganache.
        provider
    );

    //* Reading ABI
    const abi = fs.readFileSync(
        './SimpleStorage_sol_SimpleStorage.abi',
        'utf8'
    );

    //* Reading the 'Bytecode' binary file.
    const binary = fs.readFileSync(
        './SimpleStorage_sol_SimpleStorage.bin',
        'utf8'
    );

    //* Creating a 'Contract Factory'
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log('Deploying, please wait...');
    const contract = await contractFactory.deploy();

    console.log(
        'Here is the transaction response:\n',
        contract.deployTransaction
    ); //this is what we get just when we first create a transaction.

    const transactionReceipt = await contract.deployTransaction.wait(1); //This is what we get when our transaction is confirmed. Here we're waiting for 1 block confirmations.
    console.log('Here is the tranasaction receipt:\n', transactionReceipt);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// Run node deploy.js to deploy the contract.
