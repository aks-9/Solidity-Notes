//* Deploying Raffle contract -10-Adding verfication

// This is '01-deploy-raffle.js' file.

//* Adding auto verification function for deployed contract.

// create a new folder called 'utils' in the root. inside this folder create a new file 'verify.js' and paste the code from the previous poject in it. Now import it here.
const {
  getNamedAccounts,
  deployments,
  network,
  run,
  ethers,
} = require('hardhat');
// const { ethers } = require('ethers');
// const { network } = require('hardhat');
const {
  developmentChains,
  networkConfig,
} = require('../helper-hardhat-config.js');
const { verify } = require('../utils/verify');
const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther('2');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let vrfCoordinatorV2Address, subscriptionId;

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      'VRFCoordinatorV2Mock'
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    // log(vrfCoordinatorV2Mock);

    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait(1);
    subscriptionId = transactionReceipt.events[0].args.subId;

    await vrfCoordinatorV2Mock.fundSubscription(
      subscriptionId,
      VRF_SUB_FUND_AMOUNT
    );
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId]['vrfCoordinatorV2'];
    subscriptionId = networkConfig[chainId]['subscriptionId']; // moved
  }

  const arguments = [
    vrfCoordinatorV2Address,
    networkConfig[chainId]['entranceFee'],
    networkConfig[chainId]['gasLane'],
    subscriptionId,
    networkConfig[chainId]['callbackGasLimit'],
    networkConfig[chainId]['interval'],
  ];

  const raffle = await deploy('Raffle', {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations,
  });

  //* Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log('Verifying...');
    await verify(raffle.address, arguments); //passing arguments
  }

  log('----------------------------------------------------');
};

module.exports.tags = ['all', 'raffle'];

/*

yarn hardhat deploy

Output:

yarn run v1.22.19
warning package.json: No license field
$ "D:\Work\Solidity Basics\Patrick Collins\9_hardhat-smartcontract-lottery\node_modules\.bin\hardhat" deploy
Nothing to compile
Local network detected! Deploying mocks...
deploying "VRFCoordinatorV2Mock" (tx: 0x12925340c9bd03dbda39b85b0c207149c2bc46f19e3a0c825e92642eb0713167)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180a2315678afecb367f032d93F642f64180aa3 with 2539340 gas
Mocks Deployed!
-----------------------------------------------------------------
deploying "Raffle" (tx: 0xdfbf251c21a3f58a09d13567696e2f336bc1fd8bb48e434d8a5048bd7307039d)...: deployed at 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 with 12229704C703E8D87F634fB0Fc9 with 1222978 gas
----------------------------------------------------
Done in 4.07s.

*/
