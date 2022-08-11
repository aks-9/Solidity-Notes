//* Programmatic verification -1

// We'll use a hardhat plugin called 'hardhat-etherscan' to auto verify our contract after its deployment.

// yarn add --dev @nomiclabs/hardhat-etherscan

// import it in the hardhat.config.js' file like this:
// require('@nomiclabs/hardhat-etherscan');

// This is 'hardhat.config.js' file.

require('@nomicfoundation/hardhat-toolbox');

require('dotenv').config(); // importing to read '.env' file.
require('@nomiclabs/hardhat-etherscan'); // for programmatic verification.

/** @type import('hardhat/config').HardhatUserConfig */

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const ETHERSCAN_API = process.env.ETHERSCAN_API; //reading

//* Here we define our networks in Hardhat.
module.exports = {
    defaultNetwork: 'hardhat',
    networks: {
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [RINKEBY_PRIVATE_KEY],
            chainId: 4,
        },
    },
    solidity: '0.8.8',
    etherscan: {
        // Adding etherscan API key
        apiKey: ETHERSCAN_API,
    },
};

/*

*/
