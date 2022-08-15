//* Mocking -4

// This is '01-deploy-fund-me.js' file.

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // Earlier we have used 'contractFactory' to deploy a contract. But with 'hardhat-deploy' we can simply use 'deploy' function.
    // The deploy function takes two arguments, first is the name of the contract, second is the overrides.
    const fundMe = await deploy('FundMe', {
        from: deployer,
        args: [
            /* address */
        ], // Passing arguments to the constructor. In our contract, we have a Price Feed address.
        log: true, // custom logging so that we don't have to use 'console.log'
    });
};

/*

We need to pass arguments to the constructor of 'FundMe' contract. It takes an address of the Price Feed contract, that will change according to the chain we are working on.
So we will use chaiId to decide which address we need to use.

If chainId is X use address A.
IF chainId is Y use address B.


We can take inspiration from AAVE github, and we will create a 'helper-hardhat-config.js' file.

*/
