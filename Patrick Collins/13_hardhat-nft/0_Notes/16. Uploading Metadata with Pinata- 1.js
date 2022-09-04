//* 16. Uploading Metadata with Pinata- 1

// This is '02-deploy-random-ipfs-nft.js' file.

const { network } = require('hardhat');
const {
    networkConfig,
    developmentChains,
} = require('../helper-hardhat-config');
const { storeImages } = require('../utils/uploadToPinata');
const imagesLocation = './images/randomNft/';

// creating a template for our Metadata of the NFTs.
const metadataTemplate = {
    name: '',
    description: '',
    image: '',
    attributes: [
        {
            trait_type: 'Cuteness',
            value: 100,
        },
    ],
};

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    if (process.env.UPLOAD_TO_PINATA == 'true') {
        tokenUris = await handleTokenUris();
    }

    let vrfCoordinatorV2Address, subscriptionId;

    if (developmentChains.includes(network.name)) {
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

module.exports.tags = ['all', 'randomipfs', 'main'];
