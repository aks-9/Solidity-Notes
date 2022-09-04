//* 23. Intro to Encoding Function Calls Directly

//* This is 'Encoding.sol' file.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Encoding {
    //* Since we know that our solidity is just going to get compiled down to this binary stuff to send a transaction...We could just populate the 'data' field of our transactions ourselves, with the binary the code is going to use. This allows us to send transactions to do EXACTLY what we want them to do...

    //* While deploying, the 'To' field will be empty and the 'data' field of the transaction will have the binary of the contract.
    //* And while a function call, the 'To' field will be 'the address the Tx is sent to' and  we can populate the 'data' field with 'what to send to the To address'.

    //* Now we can populate the 'data' field ourselves in a transaction to call a funciton.

    // Remeber how before I said you always need two things to call a contract:
    // 1. ABI
    // 2. Contract Address?
    // Well... That was true, but you don't need that massive ABI file.
    //* All we need to know is how to create the binary, to call the functions that we want to call.

    // Solidity has some more "low-level" keywords, namely "staticcall" and "call". We've used call in the past, but haven't really explained what was going on. There is also "send"... but basically forget about send.

    //* call: How we call functions to change the state of the blockchain.
    //* staticcall: This is how (at a low level) we do our "view" or "pure" function calls, and potentially don't change the blockchain state.

    // When you call a function, you are secretly calling "call" behind the scenes, with everything compiled down to the binary stuff for you. Flashback to when we withdrew ETH from our raffle:

    // Remember this?
    function withdraw(address recentWinner) public {
        (bool success, ) = recentWinner.call{value: address(this).balance}('');
        require(success, 'Transfer Failed');
    }

    // - In our {} we were able to pass specific fields of a transaction, like 'value'.
    // - In our () we were able to pass 'data' in order to call a specific function - but there was no function we wanted to call!
    // We only sent ETH, so we didn't need to call a function!
    //* If we want to call a function, or send any data, we'd do it in these parathesis!

    // Let's look at next contract to explain this more...
}
