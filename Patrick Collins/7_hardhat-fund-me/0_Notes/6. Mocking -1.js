//* Mocking -1

// This is '01-deploy-fund-me.js' file.

//* Mocking is used for unit testing. An object under test may have dependencies on other (complex) objects. To isolate the behavior of the object, you want to replace the other objects by mocks that simulate the behavior of the real objects. In short, mocking is creating objects that simulate the behavior of real objects.

// This means that we want to create a fake Price Feed contract that we can control and work with locally. As we can't use the Price Feed of Chainlink in our 'PriceController.sol' contract as that works only on testnet or mainnet.

// If we are on a local development network, we need to deploy mocks!

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;

    const { deployer } = await getNamedAccounts();

    const chainId = network.config.chainId;
};

/*
//*  What happens when we want to change chains?

Every chain has a different contract for Price Feed of ETH/USD. On each of them, the price will be a little bit different.

We also need to modularize the hard coded address of the 'Price Feed' contract. So that no matter what chain we deploy to, we don't have to change our code. We can achieve this by passing the 'Price Feed' address in the constructor of our 'FundMe' contract.
*/
