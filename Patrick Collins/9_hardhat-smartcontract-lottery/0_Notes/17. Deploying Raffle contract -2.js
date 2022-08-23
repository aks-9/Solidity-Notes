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

module.exports = {
  defaultNetwork: 'hardhat', //adding
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    }, //adding
    Rinkeby: {
      chainId: 4,
      blockConfirmations: 6,
      accounts: [PRIVATE_KEY],
      url: RINKEBY_RPC_URL,
    }, //adding
  },
  solidity: '0.8.7',
  namedAccounts: {
    //adding
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
};
