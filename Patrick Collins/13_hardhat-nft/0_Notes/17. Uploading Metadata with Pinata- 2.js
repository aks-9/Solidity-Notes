//* 17. Uploading Metadata with Pinata- 2

// This is 'uploadToPinata.js' file.

//* create a function to store metadata in Pinata.

const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pinataApiKey = process.env.PINATA_API_KEY || '';
const pinataApiSecret = process.env.PINATA_API_SECRET || '';
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath);
    const files = fs.readdirSync(fullImagesPath);
    console.log('uploading to Pinata...');

    let responses = [];

    for (fileIndex in files) {
        console.log(`Working on file at index:${fileIndex}...`);

        const readableStreamForFile = fs.createReadStream(
            `${fullImagesPath}/${files[fileIndex]}`
        );

        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFile);
            responses.push(response);
        } catch (error) {
            console.log(error);
        }
    }

    return { responses, files };
}

//* To store the Metadata in the Pinata.
async function storeTokenUriMetadata(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata); // This will also give us IpfsHash.
        return response;
    } catch (error) {
        console.log(error);
    }
    return null;
}

module.exports = { storeImages, storeTokenUriMetadata }; // exporting 'storeTokenUriMetadata'

/*

*/
