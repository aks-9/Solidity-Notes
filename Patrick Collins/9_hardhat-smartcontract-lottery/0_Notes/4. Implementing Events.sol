//* Implementing Events

//This is 'contracts/Raffle.sol' file

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

//ERROR CODE
error Raffle__NotEnoughEthEntered();

contract Raffle {
    // STATE VARIABLES
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    // EVENTS
    event RaffleEnter(address indexed player);

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughEthEntered();
        }
        s_players.push(payable(msg.sender));

        emit RaffleEnter(msg.sender); // emitting an event
    }

    // function pickRandomWinner() public {}

    // GETTERS
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
