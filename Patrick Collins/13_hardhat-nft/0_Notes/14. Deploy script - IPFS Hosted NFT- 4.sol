//* 14. Deploy script - IPFS Hosted NFT- 4

// This is '02-deploy-random-ipfs-nft.js' file.

//* Uploading token images with Pinata -3

const { network } = require('hardhat');
const {
    networkConfig,
    developmentChains,
} = require('../helper-hardhat-config');
const { storeImages } = require('../utils/uploadToPinata'); //importing

const imagesLocation = './images/randomNft/'; // File location of our images.

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    if (process.env.UPLOAD_TO_PINATA == 'true') {
        tokenUris = await handleTokenUris();
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

    await storeImages(imagesLocation); // calling to store images.

    // args = [
    //     vrfCoordinatorV2Address,
    //     subscriptionId,
    //     networkConfig[chainId]['gasLane'],
    //     networkConfig[chainId]['mintFee'],
    //     networkConfig[chainId]['callbackGasLimit'],
    //     // tokenUris,
    // ];
};

async function handleTokenUris() {
    tokenUris = [];

    return tokenUris;
}

module.exports.tags = ['all', 'randomipfs', 'main']; //adding

// create a 'test' folder in the 'contracts' folder and add 'VRFCoordinatorV2Mock.sol' in it from our Raffle project.

/*

yarn hardhat deploy --tags randomipfs, mocks

OUTPUT:

Compiled 3 Solidity files successfully
Done in 35.38s.
*/
