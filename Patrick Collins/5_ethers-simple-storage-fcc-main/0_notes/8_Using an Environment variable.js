//* Using an Environment variable.

// An Environment variable allows us to keep our sensitive data in an '.env' file that is not shared with anybody. To not upload the '.env' file, we add it to our '.gitignore' file. We can read from '.env' file while working on the project. To read from '.env' file, we will install a node module called 'dotenv'.

// yarn add dotenv

const ethers = require('ethers');
const fs = require('fs-extra');
require('dotenv').config(); //importing

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL); // fetching RPC URL from an '.env' file.
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // fetching private key from an '.env' file.
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

    console.log(
        `Current favorite number is: ${currentFavouriteNumeber.toString()}`
    );

    const transactionResponse = await contract.store('7');
    const transactionReceipt = await transactionResponse.wait(1);

    const updatedFavoriteNumber = await contract.retrieve();
    console.log(`Updated favorite number is: ${updatedFavoriteNumber}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// Run node deploy.js to deploy the contract.
