//* Programmatic verification -3

// This is 'deploy.js' file.

const { ethers, run, network } = require('hardhat');
// Also importing 'network' to get configuration information of the networks.

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        'SimpleStorage'
    );

    console.log('Deploying the contract...');
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();

    console.log(`Deployed contract to: ${simpleStorage.address}`);

    // What happens when we deploy to our hardhat network? We can't verify on hardhat network. So we'll only call verify function, if we're on a network other than the hardhat network. We'll will use 'chainId' for this. For Rinkeby, the 'chianId' is 4.

    // console.log(network.config); // it has the 'chainId'

    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        console.log('Waiting for block confirmations...');

        await simpleStorage.deployTransaction.wait(6); //waiting for 6 blocks confirmation.
        await verify(simpleStorage.address, []); //calling verify function. The second argument is an empty array, as our contract doesn't have a constructor, so no arguments are passed.
    }
}

//* To auto verify contract
// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
    //using arrow function.
    console.log('Verifying contract...');

    try {
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes('already verified')) {
            console.log('Already Verified!');
        } else {
            console.log(e);
        }
    }
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

/*





*/
