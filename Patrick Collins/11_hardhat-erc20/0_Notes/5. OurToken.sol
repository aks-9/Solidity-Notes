//* Using OpenZeppelin library to create ERC20 token.

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// Install Openzepplin contracts:
// yarn add --dev @openzeppelin/contracts

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; //importing ERC20 contract.

// Inheriting ERC20 to our contact.
contract OurToken is ERC20 {
    // Passing the 'initialSupply' in our contract's constructor. This is the total number of token to be created.
    // Adding a name and symbol of our token in the ERC20's constructor. This is required as in the ERC20 contract, it is defined.
    constructor(uini256 initialSupply) ERC20("Our Token", "OT") {
        _mint(msg.sender, initialSupply); // calling the mint fuction of ERC20 to create new tokens. The deployer is 'msg.sender', who will get all the newly created tokens.
        //Solidity doesn't work well with decimals, so if we say initialSupply is 50, that will be 50 wei.
        // initial supply 50e18
        // 50 * 10**18 // this is 50 times 10 to the power of 18. That means we have 18 decimals. We can change this by overriding the 'decimals' functions from ERC20 contract.
    }
}
