// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract FallbackExample {
    uint256 public result;

    

    // No function' keyword is used, as solidity knows that this is a special function that can only be used once. It must be 'external', and have 'payable'. This 'receive' function will be triggered, even when we send 'eth' to this contract  without any data associated with the transaction.
    receive() external payable {
        result = 2;
    }

    // Fallback function must be declared as external. Similar to receive()' function, but it is triggered when a transaction has some data with it. If no function matches that data in the contract, 'fallback' function gets triggered.
    fallback() external payable {
        result = 1;
    }
}

    // Explainer from: https://solidity-by-example.org/fallback/
    // Ether is sent to contract
    //      is msg.data empty?
    //          /   \ 
    //         yes  no
    //         /     \
    //    receive()?  fallback() 
    //     /   \ 
    //   yes   no
    //  /        \
    //receive()  fallback()
