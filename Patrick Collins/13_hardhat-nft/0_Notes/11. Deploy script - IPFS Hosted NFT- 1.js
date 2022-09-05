//* 11. Deploy script - IPFS Hosted NFT- 1

// create a new file in the 'deploy' folder called '02-deploy-random-ipfs-nft.js'.
// This is '02-deploy-random-ipfs-nft.js' file.

const { network } = require('hardhat');
const {
    networkConfig,
    developmentChains,
} = require('../helper-hardhat-config');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let vrfCoordinatorV2Address, subscriptionId;

    if (developmentChains.includes(network.name)) {
        // create VRFV2 Subscription
        const vrfCoordinatorV2Mock = await ethers.getContract(
            'VRFCoordinatorV2Mock'
        );
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;

        const tx = await vrfCoordinatorV2Mock.createSubscription();
        const txReceipt = await tx.wait();

        subscriptionId = txReceipt.events[0].args.subId;
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
        subscriptionId = networkConfig[chainId].subscriptionId;
    }

    log('----------------------------------------------------');

    // The arguments for our NFT contract.
    args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId]['gasLane'],
        networkConfig[chainId]['mintFee'],
        networkConfig[chainId]['callbackGasLimit'],
        // tokenUris, // We don't have this right now. For this, we need to upload the images to Pinata/ IPFS, and then update the Metadata, which we will do in the next lesson.
    ];
};
