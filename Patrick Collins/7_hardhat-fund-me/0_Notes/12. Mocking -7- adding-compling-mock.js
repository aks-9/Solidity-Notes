//* Mocking -7

//* Add and compile a mock contract.

// This is '00-deploy-mocks.js' file.

const { networkConfig } = require('..helper-hardhat-config');
const { network } = require('hardhat'); // importing

// In the contracts folder, create a subfolder called 'test', and then create a mock contract named 'MockV3Aggregator.sol'. Then import the mock contract from the chainlink github:

/*

SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import '@chainlink/contracts/src/v0.6/tests/MockV3Aggregator.sol';

*/

// Make sure to add a compiler version of 0.6.6 in the 'hardhat.config.js':
/*

solidity: {
        compilers: [
            {
                version: '0.8.8',
            },
            {
                version: '0.6.6',
            },
        ],
    },

*/

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    const ethUsdPriceFeed = networkConfig[chainId]['ethUsdPriceFeed'];
};

/*
 yarn hardhat compile
*/
