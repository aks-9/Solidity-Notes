//* 18. Uploading Metadata with Pinata- 3

// This is '02-deploy-random-ipfs-nft.js' file.

const { network } = require('hardhat');
const {
    networkConfig,
    developmentChains,
} = require('../helper-hardhat-config');
const {
    storeImages,
    storeTokenUriMetadata,
} = require('../utils/uploadToPinata'); //importing 'storeTokenUriMetadata'
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

// updating this function.
async function handleTokenUris() {
    tokenUris = [];

    const { responses: imageUploadResponses, files } = await storeImages(
        imagesLocation
    ); // The 'storeImages' function returns two parameters. So here we're extracting 'responses' array and 'files' which is a 'const', from 'storeImages' function. Then renaming the 'responses' as 'imageUploadResponses'. The 'files' contains the image files we've uploaded e.g. pug.png.
    // The 'responses' object has a list of 'response', that is returned by Pinata after we've uploaded an image. This 'response' is a hash of the file we've uploaded.

    // Now we'll loop through this list of hashes from Pinata, that is 'imageUploadResponses', and upload each of the metadata.
    for (imageUploadResponseIndex in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate }; // using 'spread' operator to unpack the elements of our template and saving it to a variable.

        //* Create the metadata
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(
            '.png',
            ''
        ); //populating the 'name' element of our metadata, with the name of the file at 'imageUploadResponseIndex', and replacing the extention of the filename with an empty string.

        tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`; // populating the 'description' element
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`; // populating the 'image' element with IPFS hash that we get from the 'imageUploadResponses' array at the index 'imageUploadResponseIndex'. The function we had called to get the response is 'pinFileToIPFS', which returns a 'IpfsHash' in the 'response'.

        console.log(`Uploading ${tokenUriMetadata.name}...`);

        //* Upload the metadata. Store the JSON to Pinata/IPFS.
        const metadataUploadResponse = await storeTokenUriMetadata(
            tokenUriMetadata
        ); // storing the 'IpfsHash' along with other parameters returned when we upload the metadata to Pinata.

        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`); // updating the 'tokenUris' array with the 'IpfsHash' returned when we upload the metadata to Pinata.
    }

    console.log('Token URIs uploaded! They are:');
    console.log(tokenUris);
    return tokenUris; // returning
}

module.exports.tags = ['all', 'randomipfs', 'main'];

// yarn hardhat deploy

/*
OUTPUT:

Nothing to compile
Local network detected! Deploying mocks...
deploying "VRFCoordinatorV2Mock" (tx: 0x68ffbae2e27234b942988bbefad0daded74132f89b0f354c90a0853037d1b9b5)...: deployed at 0xf5c4a909455C00B99A90d93b48736F3196DB5621 with 1803306 gas
Mocks Deployed!
-----------------------------------------------------------------
----------------------------------------------------
deploying "BasicNft" (tx: 0x8711b2485ca42b6366a8e488d960ff24bb13ece0143799852d63fef0a59d86b8)...: deployed at 0xFD2Cf3b56a73c75A7535fFe44EBABe7723c64719 with 2020837 gas
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
Done in 20.45s.

* Each 'IpfsHash' will point to the metadata, which will have the image uri.



*/
