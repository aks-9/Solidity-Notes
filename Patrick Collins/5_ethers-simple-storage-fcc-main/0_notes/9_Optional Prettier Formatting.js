//* Optional Prettier Formatting

// It helps us create a file called '.prettierrc' that has our configs.

// npm install --save-dev prettier prettier-plugin-solidity
// yarn add prettier prettier-plugin-solidity

const ethers = require('ethers');
const fs = require('fs-extra');
require('dotenv').config();

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
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

    await contract.deployTransaction.wait(1);

    //* Getting favourite number from contract by calling the 'retrieve' function.
    const currentFavouriteNumeber = await contract.retrieve();

    console.log(currentFavouriteNumeber.toString());
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
