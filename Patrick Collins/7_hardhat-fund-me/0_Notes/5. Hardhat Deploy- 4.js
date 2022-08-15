//* Hardhat Deploy- 4

// This is '01-deploy-fund-me.js' file.

//* Using syntactic sugar

// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre;
// };

module.exports = async ({ getNamedAccounts, deployments }) => {
    // instead of 'hre' we are directly using '{ getNamedAccounts, deployments }'. This is called syntactic sugar.

    const { deploy, log } = deployments; // getting 'deploy' and 'log' functions from 'deployments'.

    const { deployer } = await getNamedAccounts(); // getting the deployer account.

    // add the following to the 'hardhat.config.js' file under 'module.exports':

    /*
    namedAccounts: {
        deployer: {
            default: 0, //* here this will by default take the first account as deployer
            1: 0, //* similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
    
    */

    const chainId = network.config.chainId; //getting the chain ID
};
