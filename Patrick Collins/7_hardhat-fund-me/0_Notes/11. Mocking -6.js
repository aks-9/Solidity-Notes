//* Mocking -6

// This is '01-deploy-fund-me.js' file.

const { networkConfig } = require('../helper-hardhat-config'); // importing our network config.
const { network } = require('hardhat'); // importing

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    const ethUsdPriceFeed = networkConfig[chainId]['ethUsdPriceFeed']; //accessing the 'ethUsdPriceFeed' of a particular 'chainId' in 'networkConfig'.

    // If the contract doesn't exist, we deploy a minimal version of it for our local testing.
    // we create a mock by creating a new deploy script in the 'deploy' folder, and name it '00-deploy-mocks.js'. It will be used when we write a script to deploy our 'FundMe' contract, in case we're on a network that doesn't have a Price Feed contract on it, like 'hardhat-network' or 'localhost'.

    const fundMe = await deploy('FundMe', {
        from: deployer,
        args: [],
        log: true,
    });
};

/*

*/
