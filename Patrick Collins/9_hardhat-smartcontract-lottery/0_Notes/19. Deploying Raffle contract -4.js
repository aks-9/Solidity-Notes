//* Deploying Raffle contract -4

// create a new file '00-deploy-mocks.js' inside the 'deploy' folder.

// This is '00-deploy-mocks.js' file.

const { getNamedAccounts, deployments, network, ethers } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config.js'); //importing

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // If we are on a local development network, we need to deploy mocks!
  if (developmentChains.includes(network.name)) {
    log('Local network detected! Deploying mocks...');
  }
};
module.exports.tags = ['all', 'mocks'];
