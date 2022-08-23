//* Introduction to Events

//* Whenever we update a dynamic data structure like an array or mapping, we want to 'emit' an event. A good way to name an 'event' is to reverse the function name.

// EVM has a logging functionality. When things happen on the blockchain, then the EVM writes these things to its specific data structure called 'logs'. You can make an 'eth_getLogs' call to get the logs when you're connected to a node.

// Inside these logs there is an important piece of logging called 'events'.
// 'Events' allow you to print information to this logging data structure, in a way that is more gas efficient than something like storing it to a 'storage' variable.

// These 'events' and other logging data are in a special data structure called 'logs' that aren't accessible to smart contracts. Each of these 'events' are tied to the smart contracts or account addresses that emitted these 'events' in these transactions.

// We can listen for these 'events' in case we want to monitor certain activity and take some action based on it.

// For example, a website reloads when your transaction is completed, in the background it was listening to an event that confirms the transaction has completed. Events are very important for a website's frontend.

// Some times there are way too many events, so we 'index' certain events in order to query them later on.

// SYNTAX:
/*

* Defining an event:

event StoredNumber(
    uint indexed oldNumber,
    uint indexed newNumber,
    uint newNumber,
    address indexed sender
)

The 'indexed' parameters or 'topic' are the ones that are easier to search than the non-indexed parameters. The non-indexed parameters are harder to search as they get ABI encoded and you've to know the contract's ABI to decode them. 

You can have upto 3 'indexed' parameters. The 'indexed' parameters cost more gas than the non-indexed parameters.


* Emiting an event/ calling an event in a function.
 
 emit(
    favoriteNumber,
    _favoriteNumber,
    favoriteNumber + _favoriteNumber,
    msg.sender
    );

Emiting an event stores the event's data to the 'logs' data location. 

----------------------------------------------------------------------------------------------

*/

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract SimpleStorage {
    uint256 favoriteNumber;

    // Defining an 'event'
    event storedNumber(
        uint256 indexed oldNumber,
        uint256 indexed newNumber,
        uint256 addedNumber,
        address sender
    );

    function store(uint256 _favoriteNumber) public {
        // Emitting an 'event'
        emit storedNumber(
            favoriteNumber,
            _favoriteNumber,
            _favoriteNumber + favoriteNumber,
            msg.sender
        );
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }
}
