//* Hardhat Deploy- 1

// In the previous sections we used the manually written deploy scripts. But if we have multiple contracts then keeping track of all these deployments become tricky. A deploy script doesn't save our deployments to any file. The tests don't work hand in hand with a deploy script. So to overcome these problems, instead of a single deploy script, we're going to use a package called 'hardhat-deploy' to deploy all our contracts.

// https://github.com/wighawag/hardhat-deploy
// A Hardhat Plugin For Replicable Deployments And Easy Testing

// yarn add --dev hardhat-deploy

// Import it in the 'hardhat.config.js' file
// require('hardhat-deploy');

// This is 'hardhat.config.js' file.
require('@nomiclabs/hardhat-waffle');
require('hardhat-gas-reporter');
require('@nomiclabs/hardhat-etherscan');
require('dotenv').config();
require('solidity-coverage');
require('hardhat-deploy'); //importing

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: '0.8.8',
};

// Delete the old 'deploy.js' file from 'scripts' folder.
// Now if you run 'yarn hardhat', you will see a new task 'deploy' in there.
// We're going to use this 'deploy' task to perform all of our deployments.

// create a new folder called 'deploy' in the root of the project, this is where we will add our deploy scripts.

// Since we would also need 'ethers', we will run the following:
// yarn add --dev  @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers

// Here we're overwriting  'hardhat-ethers' with 'hardhat-deploy-ethers'. This will enable 'ethers' to keep track of and remember all the different deployments that we make.
