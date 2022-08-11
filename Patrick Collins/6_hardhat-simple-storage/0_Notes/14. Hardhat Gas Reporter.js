//* Hardhat Gas Reporter

// This is 'hardhat.config.js' file.

// It is an extention that gets attached to our tests, and tells us how much gas does each of our functions cost.
// yarn add hardhat-gas-reporter --dev

require('@nomicfoundation/hardhat-toolbox');

require('dotenv').config();
require('@nomiclabs/hardhat-etherscan');
require('./tasks/block-number');
require('hardhat-gas-reporter'); //importing

/** @type import('hardhat/config').HardhatUserConfig */

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const ETHERSCAN_API = process.env.ETHERSCAN_API;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

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
        apiKey: ETHERSCAN_API,
    },
    gasReporter: {
        //* adding gas reporter
        enabled: true,
        outputFile: 'gas-report.txt', //saving to a file
        noColors: true, //colors get messed up in file so we make it 'true'.
        currency: 'USD', // to get value in US Dollers.
        coinmarketcap: COINMARKETCAP_API_KEY, // API to fetch US Doller value.
        token: 'MATIC', // If we're deploying to Polygon.
    },
    localhost: {
        url: 'http://localhost:8545',
        chainId: 31337,
    },
};

/*
Now when we run our test, it will automatically run this gas reporter.


  SimpleStorage
    √ Should start with the favorite number equal to 0
    √ Should store the favorite number equal to 7

·----------------------------|----------------------------|-------------|-----------------------------·
|    Solc version: 0.8.8     ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 30000000 gas  │
·····························|····························|·············|······························
|  Methods                                                                                            │
··················|··········|··············|·············|·············|···············|··············
|  Contract       ·  Method  ·  Min         ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
··················|··········|··············|·············|·············|···············|··············
|  SimpleStorage  ·  store   ·           -  ·          -  ·      43724  ·            1  ·          -  │
··················|··········|··············|·············|·············|···············|··············
|  Deployments               ·                                          ·  % of limit   ·             │
·····························|··············|·············|·············|···············|··············
|  SimpleStorage             ·           -  ·          -  ·     463682  ·        1.5 %  ·          -  │
·----------------------------|--------------|-------------|-------------|---------------|-------------·

  2 passing (3s)

Done in 8.11s.

==> This output can be seen in 'gas-report.txt' file.

*/
