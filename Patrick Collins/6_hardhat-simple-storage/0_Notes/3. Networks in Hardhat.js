//* Networks in Hardhat

// Hardhat comes built-in with 'Hardhat Network', a local Ethereum network node designed for development. It allows you to deploy your contracts, run your tests and debug your code, all within the confines of your local machine. This is the default network in hardhat. It comes with multiple accounts and private keys already built-in. So we don't have to define an RPC url or a private key.

// This is 'hardhat.config.js' file.

require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config(); // importing to read '.env' file.

/** @type import('hardhat/config').HardhatUserConfig */

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL; //reading from '.env' file.
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY; //reading from '.env' file.

//* Here we define our networks in Hardhat.
module.exports = {
    defaultNetwork: 'hardhat', // This is the default network. If we have multiple networks then we can run our scripts with '--network networkName'
    networks: {
        //* Adding more networks.
        // We've to specify the RPC url, private key, chainId etc. We can import them from '.env' file. For that we must install 'dotenv' package.
        // yarn add --dev dotenv
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [RINKEBY_PRIVATE_KEY],
            chainId: 4,
        },
    },
    solidity: '0.8.8',
};

/*
Now you should be able to deploy your contract to Rinkeby test net by running:

yarn hardhat run scripts/deploy.js --network rinkeby


yarn run v1.22.19
$ "D:\Work\Solidity Basics\Patrick Collins\6\node_modules\.bin\hardhat" run scripts/deploy.js --network rinkeby
Deploying the contract...
Deployed contract to: 0xb1b74ec625A302a4a2DCdA40FEFE85a7B27DBfBA
Done in 20.78s.

*/
