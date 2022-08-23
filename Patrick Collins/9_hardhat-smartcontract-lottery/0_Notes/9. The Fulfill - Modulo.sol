//* Implementing Chainlink VRFs (The Fulfill - Modulo).

//This is 'contracts/Raffle.sol' file

//* We'll define the function to pick the winner based on the random number we've received from the VRF. Also learn about 'Modulo' function, which gives us the remainders.

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol"; // importing

//ERROR CODE
error Raffle__NotEnoughEthEntered();
error Raffle__TransferFailed(); //adding

contract Raffle is VRFConsumerBaseV2 {
    // STATE VARIABLES
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;

    // Lottery VARIABLES
    address private s_recentWinner;

    // EVENTS
    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed player); //adding

    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughEthEntered();
        }
        s_players.push(payable(msg.sender));

        emit RaffleEnter(msg.sender);
    }

    // The Request
    function requestRandomWinner() external {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestedRaffleWinner(requestId);
    }

    //* The Fulfill
    // We won't use the 'requestId' but this function need to have it as a parameter, so we make it like this: /* requestId */
    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        // if we have s_players size 10
        // and our randomNumber is 202
        // 202 % 10 ? what's doesn't divide evenly into 202?
        // 20 * 10 = 200
        // 2
        // 202 % 10 = 2 is the remainder, which is between 0 to 9, which are the indexes of our array, as we picked its size = 10.
        uint256 indexOfWinner = randomWords[0] % s_players.length; // as we have one 1 random word at index 0 in the array 'randomWords'
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner; // seeting the storage variable.

        //* sending money to winner
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        // require(success, "Transfer failed");
        if (!success) {
            revert Raffle__TransferFailed();
        }
        emit WinnerPicked(recentWinner); // this will help us query all the previous winners as we don't have any list of them.
    }

    // GETTERS
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    } //adding
}
