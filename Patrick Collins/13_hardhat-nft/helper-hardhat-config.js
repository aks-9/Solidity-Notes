//* Deploying Raffle contract - 8

// This is 'helper-hardhat-config.js' file

//* Adding more data to each chain in network config.

const { ethers } = require('ethers');

const networkConfig = {
    4: {
        name: 'rinkeby',
        vrfCoordinatorV2: '0x6168499c0cFfCaCD319c818142124B7A15E857ab',
        entranceFee: ethers.utils.parseEther('0.1'), // adding
        gasLane:
            '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc', // 30 gwei from chainlink docs
        subscriptionId: '15994',
        callbackGasLimit: '500000', // 500,000 gas
        interval: '30',
        mintFee: '10000000000000000', // 0.01 ETH
        ethUsdPriceFeed: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
    },
    31337: {
        name: 'hardhat', // adding
        entranceFee: ethers.utils.parseEther('0.1'), // adding
        gasLane:
            '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc', // 30 gwei
        callbackGasLimit: '500000', // 500,000 gas
        interval: '30',
        mintFee: '10000000000000000', // 0.01 ETH
        ethUsdPriceFeed: '0x9326BFA02ADD2366b30bacB125260Af641031331',
    },
};

const developmentChains = ['hardhat', 'locahost'];

module.exports = {
    networkConfig,
    developmentChains,
};
