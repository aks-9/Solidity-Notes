//* 28. Dynamic SVG NFT - deploy script-1

//* We need price feed address
// In the 'hardhat-helper-config.js' file add the following in the 'localhost':
// ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",

// and in the 'rinkeby' add this:
// ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",

// Since we need mocks, we need to add 'MockV3Aggregator.sol' in our 'contracts/test' folder from our previous projects.

// Now we can deploy the mock for 'MockV3Aggregator'

// This is '00-deploy-mocks.js' file.

const { getNamedAccounts, deployments, network, ethers } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config.js');

const BASE_FEE = ethers.utils.parseEther('0.25');
const GAS_PRICE_LINK = 1e9;

const DECIMALS = '18'; //adding
const INITIAL_PRICE = ethers.utils.parseEther('2000'); //adding

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // If we are on a local development network, we need to deploy mocks!
    if (developmentChains.includes(network.name)) {
        log('Local network detected! Deploying mocks...');

        await deploy('VRFCoordinatorV2Mock', {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        });

        //* adding the price feed mock
        await deploy('MockV3Aggregator', {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        });

        log('Mocks Deployed!');
        log(
            '-----------------------------------------------------------------'
        );
    }
};
module.exports.tags = ['all', 'mocks'];
