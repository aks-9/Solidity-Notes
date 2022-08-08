//* Introduction to 'ethers.js'

const ethers = require('ethers'); //importing
const fs = require('fs-extra'); //to read 'ABI' and 'Bytecode' binary file.
//run: 'yarn add fs-extra' in the terminal

//Using async function in a script.
async function main() {
    //* Creating a provider.
    // A provider is used to connect to a node of a blockchain. Here we're connecting to our local blockchain on Ganache that has a RPC server running at HTTP://127.0.0.1:7545
    const provider = new ethers.providers.JsonRpcProvider(
        'HTTP://127.0.0.1:7545'
    );
    // Make sure the Ganache is running in the background.

    //* Creating a Wallet.
    // We need a wallet with private key to interact with the blockchain. We will call the 'Wallet()' method using 'ethers', and pass the 'private key' and 'provider' as the arguments. We will use this wallet to sign the transactions.
    const wallet = new ethers.Wallet(
        'd94237967b2117817a6a49c0f47b396d0bf83796e417262f785ec010642de358',
        provider
    );

    // Before we can interact with any contract, we need its 'ABI' and 'Bytecode' binary file. So we need to read the files generated after compilation process. We will use an 'fs' module to do that.
    //* Reading ABI
    // Using 'fs' to read the file. The arguments are the path of the 'ABI' file and its encoding format.
    const abi = fs.readFileSync(
        './SimpleStorage_sol_SimpleStorage.abi',
        'utf8'
    );

    //* Reading the 'Bytecode' binary file.
    // Using 'fs' to read the file. The arguments are the path of the 'Bytecode' file and its encoding format.
    const binary = fs.readFileSync(
        './SimpleStorage_sol_SimpleStorage.bin',
        'utf8'
    );

    //* Creating a 'Contract Factory'
    // This is not the same as the contract factory pattern. In ethers, it is an object that is used to deploy a contract.
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log('Deploying, please wait...');

    const contract = await contractFactory.deploy(); // actual deployment happens here. Using 'await', as deployment might take some time, or fail. This is why we marked this function as 'async'.
    console.log(contract);
}

//as we're using async function, we have to use '.then()' and '.catch()' after the main function call.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// Run node deploy.js to deploy the contract.
