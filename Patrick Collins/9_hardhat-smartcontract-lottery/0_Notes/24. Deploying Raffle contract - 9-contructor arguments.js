//* Deploying Raffle contract - 9-contructor arguments

// This is '01-deploy-raffle.js' file.

//* Getting the contructor arguments and passing them while deploying the contract.

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
} = require('../helper-hardhat-config.js'); //importing

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId; //importing
  const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther('2'); // adding

  //* CONSTRUCTOR ARGUMENTS
  /*
  constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
    )
  */

  let vrfCoordinatorV2Address, subscriptionId; // adding

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      'VRFCoordinatorV2Mock'
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;

    //to get subscription ID on a developemetn chain
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait(1); // inside our receipt, there is an event that is emitted that has the subscrition ID.
    // emit SubscriptionCreated(s_currentSubId, msg.sender);
    // This event is emitted when we call 'createSubscription()' function.

    subscriptionId = transactionReceipt.events[0].args.subId; // getting the subscription ID

    // Fund the subscription
    // Usually, you'd need the LINK token on the real network.
    // Our mock makes it so we don't actually have to worry about sending fund
    await vrfCoordinatorV2Mock.fundSubscription(
      subscriptionId,
      VRF_SUB_FUND_AMOUNT
    );
  } else {
    //* First constructor argument
    vrfCoordinatorV2Address = networkConfig[chainId]['vrfCoordinatorV2']; // in case we're not on mocks we take address from our config based on 'chainId'.
    subscriptionId = networkConfig[chainId]['subscriptionId']; //* fourth argument
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
    args: arguments, //passing constructor arguments.
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
};

/*



*/
