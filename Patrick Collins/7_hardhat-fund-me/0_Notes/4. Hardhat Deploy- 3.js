//* Hardhat Deploy- 3

// This is '01-deploy-fund-me.js' file.

//* Using an anonymous async function

// function deployFunc(hre) {
//     console.log('hi');
// }

// module.exports.default = deployFunc;

//* arrow nameless function, wrapped with 'module.exports'.

// 'hre' is hardhat runtime environment. Whenever we run a deploy script, 'hardhat-deploy' automatically calls up this anonymous async function, and passes the hardhat object into it.
module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre; //Earlier we used to import { ethers, run, network } from hardhat. Now we will use 'hre'.
};
