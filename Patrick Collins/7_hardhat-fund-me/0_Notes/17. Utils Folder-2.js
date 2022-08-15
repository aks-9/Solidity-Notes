//* Utils Folder-2

//* importing the 'verify.js' from 'utils' folder and using it.

// This is '01-deploy-fund-me.js' file.

const {
    networkConfig,
    developmentChains,
} = require('../helper-hardhat-config');
const { network } = require('hardhat');

const { verify } = require('../utils/verify'); // importing the auto verify.

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress;

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await get('MockV3Aggregator');

        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed'];
    }
    log(
        '-----------------------------------------------------------------------'
    );

    const fundMe = await deploy('FundMe', {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
    });

    // Verifying only when not on development chains, and have an Etherscan API Key available.
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress]); // passing the contract address and list of arguments.
    }

    log(
        '-----------------------------------------------------------------------'
    );
};

module.exports.tags = ['all', 'fundme'];

/*

*/
