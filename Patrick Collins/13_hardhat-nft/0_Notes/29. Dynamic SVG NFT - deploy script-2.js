//* 29. Dynamic SVG NFT - deploy script-2

// create a new file in the 'deploy' folder, called '03-deploy-dynamic-svg-nft.js'

// This is '03-deploy-dynamic-svg-nft.js' file.

const { network } = require('hardhat');
const {
    networkConfig,
    developmentChains,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');
const fs = require('fs'); // to read the images.

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const chainId = network.config.chainId;
    let ethUsdPriceFeedAddress;

    if (developmentChains.includes(network.name)) {
        // Find ETH/USD price feed
        const EthUsdAggregator = await deployments.get('MockV3Aggregator');
        ethUsdPriceFeedAddress = EthUsdAggregator.address; //mock
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
    }

    // In the images folder, create a new folder called 'dynamicNFT'. Add the images for dynamic NFT here.

    //* Reading the images now with 'fs'
    const lowSVG = fs.readFileSync('./images/dynamicNft/frown.svg', {
        encoding: 'utf8',
    });
    const highSVG = fs.readFileSync('./images/dynamicNft/happy.svg', {
        encoding: 'utf8',
    });

    log('----------------------------------------------------');

    //* DEPLOYING THE DYNAMIC NFT CONTRACT
    arguments = [ethUsdPriceFeedAddress, lowSVG, highSVG];
    const dynamicSvgNft = await deploy('DynamicSvgNft', {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    // Verify the deployment
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log('Verifying...');
        await verify(dynamicSvgNft.address, arguments);
    }
};

module.exports.tags = ['all', 'dynamicsvg', 'main'];

/*
yarn hardhat deploy --tags "dynamicsvg,mocks"

OUTPUT:
Nothing to compile
Local network detected! Deploying mocks...
deploying "VRFCoordinatorV2Mock" (tx: 0xb237c7be128b2179d3f2f82e6ecf1cd3e72204b58dfeef3b7cc8f78a7cac6220)...: deployed at 0xFD2Cf3b56a73c75A7535fFe44EBABe7723c64719 with 1803306 gas
deploying "MockV3Aggregator" (tx: 0xa67f280141943ff3725ef0701e7cc13710820b940e80b25a2003b341c2188e81)...: deployed at 0xB22C255250d74B0ADD1bfB936676D2a299BF48Bd with 558433 gas
Mocks Deployed!
-----------------------------------------------------------------
----------------------------------------------------
deploying "DynamicSvgNft" (tx: 0x25e8f90260468a448e71bc12fc2984fbd4625225a3a45b390551a5e32cf65500)...: deployed at 0x666D0c3da3dBc946D5128D06115bb4eed4595580 with 4266679 gas
Done in 9.30s.


*/
