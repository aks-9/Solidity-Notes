//* Localhost node

// This is 'hardhat.config.js' file.

// Right now whenever we use the hardhat network, it is reset afterwards. But we can make it persist in a terminal so that we can further interact with it by running:

// yarn hardhat node

// This will give us 20 Ganache like accounts with addresses and private keys. This node isn't on the hardhat network. This is called 'localhost'.

require('@nomicfoundation/hardhat-toolbox');

require('dotenv').config();
require('@nomiclabs/hardhat-etherscan');
require('./tasks/block-number'); // custom hardhat task.

/** @type import('hardhat/config').HardhatUserConfig */

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const ETHERSCAN_API = process.env.ETHERSCAN_API;

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
    localhost: {
        // to run a local node with 20 accounts and keys.
        url: 'http://localhost:8545',
        chainId: 31337,
        // we don't need to specify the accounts, hardhat will auto pick them from the running local node.
    },
};

/*

To interact with the localhost we have to specify the --network flag in a different terminal while keeping the node running.

yarn hardhat run scripts/deploy.js --network localhost



Deploying the contract...
Deployed contract to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Current Value is: 0
Updated Value is: 7
Done in 4.23s.


==> In the running localhost, you will see all the logs of the deployment transaction.

eth_chainId
eth_accounts
eth_blockNumber
eth_chainId (2)
eth_estimateGas
eth_getBlockByNumber
eth_feeHistory
eth_sendTransaction
  Contract deployment: SimpleStorage
  Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3
  Transaction:         0x5e801cd511edc71e9d700f1e175b13b5f36f23f713f6787877cda8391bd06949
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            463682 of 463682
  Block #1:            0xd16a0d762a891d6bf3136aa70cadf09eb6936165659dccdf054980dd05c650d4

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_getTransactionReceipt
eth_chainId
eth_call
  Contract call:       SimpleStorage#retrieve
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3

eth_chainId
eth_estimateGas
eth_feeHistory
eth_sendTransaction
  Contract call:       SimpleStorage#store
  Transaction:         0x7705d6421a42c95a0e34825319c8d7d6d632512a564a27f94f91c343a652357f
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3
  Value:               0 ETH
  Gas used:            43724 of 43724
  Block #2:            0xac7f4579af3dc482dcc3815fead26b0b871ec4a2930399ab71714aca431a7d63

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_getTransactionReceipt
eth_chainId
eth_call
  Contract call:       SimpleStorage#retrieve
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3

*/
