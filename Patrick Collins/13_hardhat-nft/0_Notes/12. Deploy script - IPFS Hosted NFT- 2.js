//* 12. Deploy script - IPFS Hosted NFT- 2

// This is '02-deploy-random-ipfs-nft.js' file.

//* Uploading token images with Pinata -1

// Go to the github repo of this course and copy the 'images' folder and paste it in our project.

const { network } = require('hardhat');
const {
    networkConfig,
    developmentChains,
} = require('../helper-hardhat-config');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    //* Get the IPFS hashes of our images.
    // 1. With our own IPFS node.
    // 2. Using Pinata.
    // 3. nft.storage
    if (process.env.UPLOAD_TO_PINATA == 'true') {
        tokenUris = await handleTokenUris(); // calling this function will upload the images to Pinata and fetch the TokenUris.
    }

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

    args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId]['gasLane'],
        networkConfig[chainId]['mintFee'],
        networkConfig[chainId]['callbackGasLimit'],
        // tokenUris,
    ];
};

// This will return an array of token URIs to upload to our smart contract.
async function handleTokenUris() {
    // Check out https://github.com/PatrickAlphaC/nft-mix for a pythonic version of uploading
    // to the raw IPFS-daemon from https://docs.ipfs.io/how-to/command-line-quick-start/
    // You could also look at pinata https://www.pinata.cloud/

    tokenUris = [];

    // we need to store an image to the IPFS
    // then we need to store the metadata in the IPFS

    // Go to the 'utils' folder and create a new file 'uploadToPinata.js'

    return tokenUris;
}
