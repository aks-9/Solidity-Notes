//* Raffle.sol Setup

// Enter the lottery (paying some amount)
// Pick a random winner (verifiable random)
// Winner be selected every X minutes --> completly automate

// Chainlink Oracle -> Randomness
// Chainlink Keepers --> Automatic execution.

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract Raffle {
    // STATE VARIABLES
    uint256 private immutable i_entranceFee;
    address payable[] private s_players; // making it payable as we have to pay one of these addresses that wins the lottery.

    //ERROR CODE
    error Raffle__NotEnoughEthEntered();

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    function enterRaffle() public payable {
        //Not using 'require' statement but custom errors.
        // This function is payable since we're having people send ETH to it.
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughEthEntered();
        }
        s_players.push(payable(msg.sender)); // Have to typecast 'msg.sender' as 'payable' because 's_players' array can only store 'payable' addresses.
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
