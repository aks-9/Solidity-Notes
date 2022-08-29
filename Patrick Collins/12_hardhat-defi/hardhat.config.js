//* Deploying Raffle contract -2

// This is 'hardhat.config.js' file

require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('hardhat-deploy');
require('solidity-coverage');
require('hardhat-gas-reporter');
require('hardhat-contract-sizer');
require('dotenv').config();

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL; //adding
const PRIVATE_KEY = process.env.PRIVATE_KEY; //adding
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY; //adding
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY; //adding
const MAINNET_RPC_URL =
    process.env.MAINNET_RPC_URL || process.env.ALCHEMY_MAINNET_RPC_URL || '';

module.exports = {
    defaultNetwork: 'hardhat', //adding
    networks: {
        hardhat: {
            chainId: 31337,
            forking: {
                url: MAINNET_RPC_URL,
            },
        }, //adding
        localhost: {
            chainId: 31337,
        }, //adding
        rinkeby: {
            chainId: 4,
            blockConfirmations: 6,
            accounts: [PRIVATE_KEY],
            url: RINKEBY_RPC_URL,
        }, //adding
    },
    etherscan: {
        // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {
            rinkeby: ETHERSCAN_API_KEY,
        },
    },
    gasReporter: {
        enabled: false,
        currency: 'USD',
        outputFile: 'gas-report.txt',
        noColors: true,
        // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
    solidity: {
        compilers: [
            { version: '0.8.7' },
            { version: '0.4.19' },
            { version: '0.6.12' },
        ],
    },
    namedAccounts: {
        //adding
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    mocha: {
        timeout: 300000, // 300 seconds
    },
};
