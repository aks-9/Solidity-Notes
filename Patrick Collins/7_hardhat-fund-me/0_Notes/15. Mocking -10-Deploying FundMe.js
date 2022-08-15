//* Mocking -10

//* Deploying Fund Me

// This is '01-deploy-fund-me.js' file.

const {
    networkConfig,
    developmentChains,
} = require('../helper-hardhat-config');
const { network } = require('hardhat');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // const ethUsdPriceFeed = networkConfig[chainId]['ethUsdPriceFeed'];

    let ethUsdPriceFeedAddress; // To be able to update it, we're using 'let'.

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await get('MockV3Aggregator'); //using 'get' function from 'deployments' to get the latest deployment of 'MockV3Aggregator'

        ethUsdPriceFeedAddress = ethUsdAggregator.address; //updating
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed']; // for test/main net
    }
    log(
        '-----------------------------------------------------------------------'
    );

    const fundMe = await deploy('FundMe', {
        from: deployer,
        args: [ethUsdPriceFeedAddress], // passing to constructor.
        log: true,
    });
    log(
        '-----------------------------------------------------------------------'
    );
};

module.exports.tags = ['all', 'fundme'];

/*
yarn hardhat deploy

Nothing to compile
Local network detected! Deploying Mocks...
deploying "MockV3Aggregator" (tx: 0x2f60bd4cba5dffe33cd22380f4891cfadb7f13aad763bb084e8a1c3336b892f9)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 569635 gas
Mocks deployed !!!
----------------------------------------------------
-----------------------------------------------------------------------
deploying "FundMe" (tx: 0x10ad6679141d2afcf0e162f6bbbd8e90479d57c55d7d9698c41ee2230b202658)...: deployed at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 with 898438 gas
-----------------------------------------------------------------------
Done in 3.58s.

//* If we run our local blockchain, a localhost node, hardhat-deploy will automatically run all of our deploy scripts and add them to the node.

yarn hardhat node

Nothing to compile
Local network detected! Deploying Mocks...
deploying "MockV3Aggregator" (tx: 0x2f60bd4cba5dffe33cd22380f4891cfadb7f13aad763bb084e8a1c3336b892f9)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 569635 gas
Mocks deployed !!!
----------------------------------------------------
-----------------------------------------------------------------------
deploying "FundMe" (tx: 0x10ad6679141d2afcf0e162f6bbbd8e90479d57c55d7d9698c41ee2230b202658)...: deployed at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 with 898438 gas
-----------------------------------------------------------------------
Done in 3.58s.
PS D:\Work\Solidity Basics\Patrick Collins\7_hardhat-fund-me> yarn hardhat node
yarn run v1.22.19
warning package.json: No license field
$ "D:\Work\Solidity Basics\Patrick Collins\7_hardhat-fund-me\node_modules\.bin\hardhat" node
Nothing to compile
Local network detected! Deploying Mocks...
deploying "MockV3Aggregator" (tx: 0x2f60bd4cba5dffe33cd22380f4891cfadb7f13aad763bb084e8a1c3336b892f9)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 569635 gas
Mocks deployed !!!
----------------------------------------------------
-----------------------------------------------------------------------
deploying "FundMe" (tx: 0x10ad6679141d2afcf0e162f6bbbd8e90479d57c55d7d9698c41ee2230b202658)...: deployed at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 with 898438 gas
-----------------------------------------------------------------------
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
*/
