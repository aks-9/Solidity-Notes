// * Automatic Constant Value UI Frontend Updater -3

// * Importing the 'constants' using an 'index.js' file.

// create a new file in the 'constants' folder called 'index.js'. We will import all the constant values from their respective file in here, and then export evertything from here.

// This is 'constants/indes.js' file

const contractAddresses = require('./contractAddresses.json');
const abi = require('./abi.json');

module.exports = {
    contractAddresses,
    abi,
}; // exporting
