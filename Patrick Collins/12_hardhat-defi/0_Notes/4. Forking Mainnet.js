//* 4. Forking Mainnet

// Another way to run tests or scripts for our smart contract is 'mainnet forking' where we run a hardhat node, that mimicks to be an actual mainnet node. Forking is simply making a copy of the blockchain, but in this case we don't really copy the whole blockchain, but only the contract, which is deployed on the mainnet.

// Any time we make a reference to the the contract address on mainnet , we make an API call to our Ethereum node like Alchemy/Infura, an it returns just that specific contract to us. Forking also gives us a bunch of fake accounts on the mainnet.

//* Pros: easy, quick, and resemble what's on mainnet.
//! Cons: We need an API, some contracts are complex to work with so for them mocks are better.

// To enable Forking we must add the following to our 'hardhat.config.js' file:
/*
networks: {
        hardhat: {
            chainId: 31337,
            forking: {
                url: MAINNET_RPC_URL,
            },
        },
        localhost: {
            chainId: 31337,
        },


*/

// Go to Alchemy account, create a new app for mainnet Ethereum, get the RPC url and add it to the '.env' file and import it to the 'hardhat.config.js' file.

//* This is 'aaveBorrow.js' file.

const { getWeth } = require('../scripts/getWeth.js'); //importing

async function main() {
    await getWeth(); // calling
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// Run this script:
// We will be forking the mainnet
// yarn hardhat run scripts/aaveBorrow.js

/* 
* OUPTPUT: 

Got 20000000000000000 WETH
Done in 10.44s.

---------------------------

Which is actuall 0.020000000000000000 WETH. So we have succesfully forked the mainnet, and now we can run it locally.

*/
