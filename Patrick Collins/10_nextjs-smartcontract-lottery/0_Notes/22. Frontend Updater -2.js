// * Automatic Constant Value UI Frontend Updater -2

// This is '99-update-front-end.js' file.

// creating a function to update the ABI in the frontend.

const { ethers } = require('hardhat');
const fs = require('fs');

const FRONT_END_ADDRESSES_FILE = '../frontend/constants/contractAddresses.json';
const FRONT_END_ABI_FILE = '../frontend/constants/abi.json';

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log('Updating the front end...');

    updateContractAddresses();
    updateAbi(); // calling
  }
};

async function updateContractAddresses() {
  const raffle = await ethers.getContract('Raffle');

  const curentAddresses = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESSES_FILE, 'utf8')
  ); // reading

  const chainId = network.config.chainId.toString();

  if (chainId in curentAddresses) {
    if (!curentAddresses[chainId].includes(raffle.address)) {
      curentAddresses[chainId].push(raffle.address);
    }
  } else {
    curentAddresses[chainId] = [raffle.address];
  }

  fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(curentAddresses));
}

async function updateAbi() {
  const raffle = await ethers.getContract('Raffle');

  fs.writeFileSync(
    FRONT_END_ABI_FILE, // writing to file
    raffle.interface.format(ethers.utils.FormatTypes.json) // getting 'ABI' from raffle
  );
}

module.exports.tags = ['all', 'frontend'];

// Now if we run in the backend
// yarn hardhat node

// It will update the files in the constants folder with 'abi' and contract addresses.
