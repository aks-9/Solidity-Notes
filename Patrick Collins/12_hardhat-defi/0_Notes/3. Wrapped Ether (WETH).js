//* 2. Wrapped Ether (WETH)

// The native token of Ethereum is 'ether' or 'ETH', which is not an ERC20 token, so we will use an ERC20 token for it called 'Wrapped ether' or 'WETH'.

// ETH is sent to a WETH gateway that swaps ETH for WETH. It's basically 'ether', but is an ERC20 Token smart contract. We'll skip this sending to gateway, and we'll get the WETH token ourselves, and use that as collateral.

// create a new file called 'getWeth.js' in the 'scripts' folder.

//* This is 'getWeth.js' file.

// Here we will deposit our test ETH for test WETH.

// Link to WETH token contract on Rinkeby: https://rinkeby.etherscan.io/token/0xc778417e063141139fce010982780140aa0cd5ab#writeContract

// connect your wallet, and in the 'Write Contract' section, click on 'deposit'. Enter 0.05  and click 'write'. Copy the contract address and go to Metamask and import the WETH token.

// Similarly we can also call 'withdraw' and get our test ETH back. This is also called 'burning' your WETH token.

// We will create a module here, and import it in our 'aaveBorrow' file

const { ethers, getNamedAccounts, network } = require('hardhat');

const AMOUNT = ethers.utils.parseEther('0.02'); // amount to be deposited in WETH contract.

async function getWeth() {
    const { deployer } = await getNamedAccounts(); // getting accounts

    // We need to call 'deposit' function on WETH contract.
    // we need 'abi' and 'contract address'.
    // so we will create a new folder in our 'contracts/interfaces' folder , and create an interface 'IWeth.sol' for WETH contract to get the 'abi'. It has all the functions like an ERC20 interface, in additon to 'deposit' and 'withdraw' function.

    /*
    'IWeth.sol' uses solidity compiler 0.4.19, so add it in the 'hardhat.config.js' file:

    solidity: {
        compilers: [{ version: '0.8.7' }, { version: '0.4.19' }],
    },
    
    * Get the ABI:
    yarn hardhat compile

    * Get the WETH contract address from MAINNET : 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    
    */

    // To be get the Weth contract using the interface of IWeth.
    const iWeth = await ethers.getContractAt(
        'IWeth', //abi
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', //contract address of mainnet WETH
        deployer // connecting to deployer
    );

    // calling the 'deposit' function on WETH contract.
    const tx = await iWeth.deposit({
        value: AMOUNT,
    });
    await tx.wait(1);

    const wethBalance = await iWeth.balanceOf(deployer); // getting balance of 'deployer'

    console.log(`Got ${wethBalance.toString()} WETH`);
}

module.exports = { getWeth, AMOUNT }; // Exporting
