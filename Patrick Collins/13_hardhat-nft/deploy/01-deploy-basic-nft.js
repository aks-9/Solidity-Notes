//* 3. Basic NFT -2

// Create a new folder 'deploy'. create a new file '01-deploy-basic-nft.js' in it.

// This is '01-deploy-basic-nft.js' file.

// add 'helper-hardhat-config.js' file, 'utils' folder from previous project.

const { network } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log('----------------------------------------------------');
    arguments = [];
    const basicNft = await deploy('BasicNft', {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    // Verify the deployment
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log('Verifying...');
        await verify(basicNft.address, arguments);
    }
};

module.exports.tags = ['all', 'basicnft', 'main'];

// yarn hardhat deploy

/*

deploying "BasicNft" (tx: 0xb1ca8f364ee92876fd3efcb76206e05b6fd76071af923e56e0ee732febe55045)...: deployed at 0xCa1D199b6F53Af7387ac543Af8e8a34455BBe5E0 with 2020837 gas
Done in 29.55s.


*/
