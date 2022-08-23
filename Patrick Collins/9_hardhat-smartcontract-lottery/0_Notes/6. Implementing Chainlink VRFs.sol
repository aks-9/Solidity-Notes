//* Implementing Chainlink VRFs.

//This is 'contracts/Raffle.sol' file

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol"; //importing VRF
// yarn add --dev @chainlink/contracts
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol"; // 'Coordinator' contract that does the random number verification, and sends it to our contract by calling 'fulfillRandomWords'.

//ERROR CODE
error Raffle__NotEnoughEthEntered();

// Inheriting 'VRFConsumerBaseV2', so that our contract can request random numbers.
contract Raffle is VRFConsumerBaseV2 {
    // STATE VARIABLES
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    // EVENTS
    event RaffleEnter(address indexed player);

    // adding in our constructor 'address vrfCoordinatorV2' and passing it as an argument to the constructor of 'VRFConsumerBaseV2'
    constructor(address vrfCoordinatorV2, uint256 entranceFee)
        VRFConsumerBaseV2(vrfCoordinatorV2)
    {
        i_entranceFee = entranceFee;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughEthEntered();
        }
        s_players.push(payable(msg.sender));

        emit RaffleEnter(msg.sender); // emitting an event
    }

    function requestRandomWinner() external {
        // request the random number by calling a function called 'requestRandomWords' on 'Coordinator' contract.
        // Once we get it, do something with it. The 'Coordinator' then contract calls a function called 'fulfilledRandomWords' on our contract and set values for requested random numbers.
        // 2 transaction process
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        //Overriding the function from imorted VRF. The orginal takes two arguments. A 'requestId' and an array 'randomWords'.
    }

    // GETTERS
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}

// yarn hardhat compile

// Compiled 2 Solidity files successfully
// Done in 16.54s.
