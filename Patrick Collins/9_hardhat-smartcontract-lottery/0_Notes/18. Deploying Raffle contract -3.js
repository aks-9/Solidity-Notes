//* Deploying Raffle contract -3

// The first parameter in the constructor of our contract is 'vrfCoordinatorV2' of type 'address'. We will deploy mock for it if we're on the development chain.

// create a new file 'helper-hardhat-config.js'

//* This is 'helper-hardhat-config.js' file

const networkConfig = {
  4: {
    name: 'rinkeby',
    vrfCoordinatorV2: '0x6168499c0cFfCaCD319c818142124B7A15E857ab', // passing the address from https://docs.chain.link/docs/vrf/v2/supported-networks/#rinkeby-testnet-deprecated
  },
};

const developmentChains = ['hardhat', 'locahost'];

module.exports = {
  networkConfig,
  developmentChains,
};
