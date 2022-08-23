//* Deploying Raffle contract -1

const { network } = require('hardhat'); // importing

// Create a new folder 'deploy' in the root of the project, and create a new file in it '01-deploy-raffle.js'

// This is '01-deploy-raffle.js' file.

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const raffle = await deploy('Raffle', {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
};

/*

Create a '.env' file in the root of the project and save all the urls and keys. Go to the 'hardhat.config.js' file and add networks and import urls from '.env' file.


*/
