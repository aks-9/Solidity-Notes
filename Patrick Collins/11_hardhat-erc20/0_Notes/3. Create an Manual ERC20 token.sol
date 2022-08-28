//* 3. Create an Manual ERC20 token

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

// These will be psuedocode, not the actual implementation.
contract ManualToken {
    uint256 initialSupply; // how many tokens we're starting with.abi

    mapping(address => uint256) public balanceOf; // This smart contract works because of this mapping, which keeps track of how much balance a specific address has.

    mapping(address => mapping(address => uint256)) public allowance; // This is a nested mapping. This will tell us who is allowed which address to move how much tokens.For example, address of Partrick allows address of Partrick's brother to use Patrick's some amount of token.

    // transfer token
    // When a function caller is directly sending money to another address.
    // subtract an amount from an address  and add it to another address.
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) public {
        balanceOf[from] = balanceOf[from] - amount; //subtract an amount from an address
        balanceOf[to] = balanceOf[to] + amount; //add it to another address.
    }

    // When we want to allow another smart contract to transfer our tokens to some other address
    // We will have an 'approve' function to approve such a smart contract to move our tokens. For this we will need an 'allowance' mapping, which will tell us who is allowed which address to move how much tokens.
    // Then we will use 'transferFrom' function. This will implement taking funds from a user.
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public {
        // This function will check 'allowance' mapping if the approval is given to move how much token.
    }
}
