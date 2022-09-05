//* 13. Deploy script - IPFS Hosted NFT- 3

// This is 'uploadToPinata.js' file.

//* Uploading token images with Pinata -2
// Install Pinata SDK:
// yarn add --dev @pinata/sdk
// https://www.npmjs.com/package/@pinata/sdk

const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const path = require('path'); // yarn add --dev path

// To store images on IPFS. This takes the 'images' path as argument.
async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath); // gives full output of the path to images

    const files = fs.readdirSync(fullImagesPath); // reading the entire directory and getting the images files.

    console.log(files);

    // Now go to '02-deploy-random-ipfs-nft.js' and import this file there. Then call this 'storeImages' function with the images path.
}
module.exports = { storeImages };
