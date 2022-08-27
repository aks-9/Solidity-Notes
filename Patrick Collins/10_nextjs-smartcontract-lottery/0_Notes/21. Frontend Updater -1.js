// * Automatic Constant Value UI Frontend Updater -1

// create a new folder 'constants' in the root of the project. Within it, create two files: 'abi.json' and 'contractAddresses.json'. In both of them add '{}' and save.

// cd backend
// yarn
// yarn hardhat node
// We'll use this localhost blockchain.

// In the backend, go to the 'deploy' folder, and create a new script '99-update-front-end.js'. We want this to be always be the last script in our 'deploy' folder, so we number it 99.

//* This is '99-update-front-end.js' file.

//This script will be connected to our 'frontend' , so whenever we deploy contracts, no matter what chain we are on, we can update the frontend's 'constants' folder with 'abi' and 'contractAddresses'.

// In the '.env' file create a new variable 'UPDATE_FRONT_END = true'

const { ethers } = require('hardhat'); // importing to get contract
const fs = require('fs'); // importing to read and write to files

const FRONT_END_ADDRESSES_FILE = '../frontend/constants/contractAddresses.json'; // relative path to frontend's 'constants' folder
const FRONT_END_ABI_FILE = '../frontend/constants/abi.json';

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log('Updating the front end...');

    updateContractAddresses(); //calling to update contract addresses in frontend
  }
};

// to update contract addresses in frontend
async function updateContractAddresses() {
  const raffle = await ethers.getContract('Raffle'); // getting the new contract address.

  const curentAddresses = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESSES_FILE, 'utf8')
  ); // reading

  //* we will update the 'contractAddresses' with some new addresses.

  const chainId = network.config.chainId.toString(); // getting the chain ID of the chain we're on.

  // if the chain ID of the chain we're on, is in 'contractAddresses' file
  if (chainId in curentAddresses) {
    // checking if new contract address is NOT already in 'contractAddresses' file
    if (!curentAddresses[chainId].includes(raffle.address)) {
      // then adding the new contract address to the 'contractAddresses' file
      curentAddresses[chainId].push(raffle.address);
    }
  } else {
    // if the chain ID doesn't exist in the 'curentAddresses', we'll add a new array.
    curentAddresses[chainId] = [raffle.address];
  }

  fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(curentAddresses)); // writing to the file
}

module.exports.tags = ['all', 'frontend']; //adding tags
