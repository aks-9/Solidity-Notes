//* Solidity coverage

// It's a plugin that goes through our tests and see how many lines of code of our solidity contract's code is covered by our tests. It tells us if we have missed some lines of code in the contract for testing.

// yarn add --dev solidity-coverage

// This is 'hardhat.config.js' file.

require('@nomicfoundation/hardhat-toolbox');

require('dotenv').config();
require('@nomiclabs/hardhat-etherscan');
require('./tasks/block-number');
require('hardhat-gas-reporter');
require('solidity-coverage'); // importing

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
        enabled: false, // turned off
        outputFile: 'gas-report.txt',
        noColors: true,
        currency: 'USD',
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: 'MATIC',
    },
    localhost: {
        url: 'http://localhost:8545',
        chainId: 31337,
    },
};

/*

You can run the coverage like this:

yarn hardhat coverage

OUTPUT:

 SimpleStorage
    ✔ Should start with the favorite number equal to 0
    ✔ Should store the favorite number equal to 7 (52ms)


  2 passing (437ms)

--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts\         |       50 |      100 |    66.67 |       50 |                |
  SimpleStorage.sol |       50 |      100 |    66.67 |       50 |          31,32 |
--------------------|----------|----------|----------|----------|----------------|
All files           |       50 |      100 |    66.67 |       50 |                |
--------------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json
Done in 19.68s.d

*/
