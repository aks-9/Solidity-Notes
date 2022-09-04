//* 19. Uploading Metadata with Pinata- 4

// This is '02-deploy-random-ipfs-nft.js' file.

// * Deploying Random IPFS NFT

const { network } = require('hardhat');
const {
    networkConfig,
    developmentChains,
} = require('../helper-hardhat-config');
const {
    storeImages,
    storeTokenUriMetadata,
} = require('../utils/uploadToPinata');
const { verify } = require('../utils/verify');

const FUND_AMOUNT = '1000000000000000000000'; //adding to fund our subscription.
const imagesLocation = './images/randomNft/';

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

    tokenUris = [
        'ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo',
        'ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d',
        'ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm',
    ];

    let vrfCoordinatorV2Address, subscriptionId;

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract(
            'VRFCoordinatorV2Mock'
        );
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;

        const tx = await vrfCoordinatorV2Mock.createSubscription();
        const txReceipt = await tx.wait();

        subscriptionId = txReceipt.events[0].args.subId;
        //* Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund
        await vrfCoordinatorV2Mock.fundSubscription(
            subscriptionId,
            FUND_AMOUNT
        );
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
        subscriptionId = networkConfig[chainId].subscriptionId;
    }

    log('----------------------------------------------------');

    //* Uncommenting 'args' and 'tokenUris' in it, as now we have 'tokenUris' updated.
    args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId]['gasLane'],
        networkConfig[chainId]['callbackGasLimit'],
        tokenUris,
        networkConfig[chainId]['mintFee'],
        // add the 'mintFee' to 'helper-hardhat.config.js' file in both 'hardhat' and 'rinkeby' networks.
    ];

    //* DEPLOYING
    const randomIpfsNft = await deploy('RandomIpfsNft', {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    log('----------------------------------------------------');

    // Verify the deployment
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log('Verifying...');
        await verify(randomIpfsNft.address, args);
    }
};

async function handleTokenUris() {
    // tokenUris = [
    //     'ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo',
    //     'ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d',
    //     'ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm',
    // ];

    const { responses: imageUploadResponses, files } = await storeImages(
        imagesLocation
    );
    for (imageUploadResponseIndex in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate };

        // Create the metadata
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(
            '.png',
            ''
        );

        tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`;
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;

        console.log(`Uploading ${tokenUriMetadata.name}...`);

        //Upload the metadata. Store the JSON to Pinata/IPFS.
        const metadataUploadResponse = await storeTokenUriMetadata(
            tokenUriMetadata
        );

        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
    }

    console.log('Token URIs uploaded! They are:');
    console.log(tokenUris);
    return tokenUris;
}

module.exports.tags = ['all', 'randomipfs', 'main'];

// yarn hardhat deploy

/*
OUTPUT:

Nothing to compile
Local network detected! Deploying mocks...
deploying "VRFCoordinatorV2Mock" (tx: 0xe83e7218bf90a739f034b3920fd6dae6ca18442e9660868aff60491e8262b681)...: deployed at 0xf5c4a909455C00B99A90d93b48736F3196DB5621 with 1803306 gas
Mocks Deployed!
-----------------------------------------------------------------
----------------------------------------------------
deploying "BasicNft" (tx: 0xbe60217b2667f355944eea8ad396c32c06f3d55996cdd11c83579f6723ed22b9)...: deployed at 0xFD2Cf3b56a73c75A7535fFe44EBABe7723c64719 with 2020837 gas
uploading to Pinata...
Working on file at index:0...
Working on file at index:1...
Working on file at index:2...
Uploading pug...
Uploading shiba-inu...
Uploading st-bernard...
Token URIs uploaded! They are:
[
  'ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo',
  'ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d',
  'ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm'
]
----------------------------------------------------
deploying "RandomIpfsNft" (tx: 0xb69ad96553fe1327d5515128cc1bbbade1504adf4713ab9e254c7bce01da8dce)...: deployed at 0x666D0c3da3dBc946D5128D06115bb4eed4595580 with 3525585 gas
----------------------------------------------------
Done in 19.31s.

* Now we can set the 'UPLOAD_TO_PINATA = false' in the '.env' file.

* We can copy the array and paste it in 'tokenUris', and now since we've update the 'tokenUris', we'll use them instead of uploading again.



*/
