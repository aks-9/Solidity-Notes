//* 15. Deploy script - IPFS Hosted NFT- 5

// This is 'uploadToPinata.js' file.

//* Uploading token images with Pinata -4

const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // to read '.env' files.

const pinataApiKey = process.env.PINATA_API_KEY || ''; //adding
const pinataApiSecret = process.env.PINATA_API_SECRET || ''; //adding
const pinata = pinataSDK(pinataApiKey, pinataApiSecret); //adding. Creating an instance of pinata.

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath);
    const files = fs.readdirSync(fullImagesPath);
    console.log('uploading to Pinata...');

    let responses = []; // creating an empty array. This will be returned by this function.

    for (fileIndex in files) {
        console.log(`Working on file at index:${fileIndex}...`);

        const readableStreamForFile = fs.createReadStream(
            `${fullImagesPath}/${files[fileIndex]}`
        ); // creating a readable stream for all the data in these images, since they can't be simply pushed like normal data to a file.

        //* In the '.env' file of the project, add the following:
        // PINATA_API_KEY = cff8716c24e406677825
        // PINATA_API_SECRET = 50568740ded86239f644cd5e298012c75eb96e21176311975c058b1f09b5dec0
        // UPLOAD_TO_PINATA = true

        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFile); // passing our readable stream to 'pinFileToIPFS' function.

            responses.push(response); // pushing to our empty array created earlier.
        } catch (error) {
            console.log(error);
        }
    }

    return { responses, files }; // returning the array and files.
}
module.exports = { storeImages };

/*
yarn hardhat deploy

OUTPUT:

Nothing to compile
Local network detected! Deploying mocks...
deploying "VRFCoordinatorV2Mock" (tx: 0xe6e6eb889d4377d3fb26d99e6de74eb4afe9d1097848d97b53976c9e57ca038f)...: deployed at 
0xf5c4a909455C00B99A90d93b48736F3196DB5621 with 1803306 gas
Mocks Deployed!
-----------------------------------------------------------------
----------------------------------------------------
deploying "BasicNft" (tx: 0x372090c9ab4d6be083c76e4370cea464e1d405d0f6a1943314c94ae46ed9b020)...: deployed at 0xFD2Cf3b56a73c75A7535fFe44EBABe7723c64719 with 2020837 gas
----------------------------------------------------
uploading to Pinata...
Working on file at index: 0...
Working on file at index: 1...
Working on file at index: 2...
Done in 19.61s.




*/
