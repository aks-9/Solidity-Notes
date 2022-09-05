//* 23. Intro to Encoding Function Calls Directly

//* This is 'Encoding.sol' file.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Encoding {
    //* Since we know that our solidity is just going to get compiled down to this binary stuff to send a transaction...We could just populate the 'data' field of our transactions ourselves, with the binary the code is going to use. This allows us to send transactions to do EXACTLY what we want them to do...

    //* While deploying, the 'To' field will be empty and the 'data' field of the transaction will have the binary of the contract.
    //* And while a function call, the 'To' field will be 'the address the Tx is sent to' and  we can populate the 'data' field with 'what to send to the To address'.

    //* Now we can populate the 'data' field ourselves in a transaction to call a function.

    function withdraw(address recentWinner) public {
        (bool success, ) = recentWinner.call{value: address(this).balance}('');
        require(success, 'Transfer Failed');
    }
}
