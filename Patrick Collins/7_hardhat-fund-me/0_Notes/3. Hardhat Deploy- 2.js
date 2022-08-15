//* Hardhat Deploy- 2

// All the scripts that get added to the deploy folder, will run with a single command.
// yarn hardhat deploy

// So a good practice is to number them, so they run in the order that we want them to run.

// create '01-deploy-fund-me.js' file in the 'deploy' folder.

// This is '01-deploy-fund-me.js' file.

// * We're going to create a function 'deployFunc', and export this deploy function as the default function so our 'hardhat-deploy' will look for it.

function deployFunc(hre) {
    console.log('hi');
}

module.exports.default = deployFunc; // making it the default exported function.

// yarn hardhat deploy
