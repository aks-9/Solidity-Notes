//* Deploying Raffle contract - 7

const {
  getNamedAccounts,
  deployments,
  network,
  run,
  ethers,
} = require('hardhat');

// const { ethers } = require('ethers');
// const { network } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config.js'); //importing

// This is '01-deploy-raffle.js' file.

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  let vrfCoordinatorV2Address; // adding the first argument of the constructor of our contract.

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      'VRFCoordinatorV2Mock'
    ); //getting the mock contract.
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address; //getting the mock address.
  }

  const args = []; //adding

  const raffle = await deploy('Raffle', {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
};

/*



*/
