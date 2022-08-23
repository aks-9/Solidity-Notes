//* Implementing Chainlink VRFs (The Request).

//This is 'contracts/Raffle.sol' file

//* Here we will create the function that will make the 'request' to the 'Cordinator' contract for the random numbers.

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol"; // importing

//ERROR CODE
error Raffle__NotEnoughEthEntered();

// Inherting 'VRFConsumerBaseV2'
contract Raffle is VRFConsumerBaseV2 {
    // STATE VARIABLES
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator; // creating a variable of type 'Coordinator' contract.

    bytes32 private immutable i_gasLane; //diffrent max gas price you're willing to pay in 'wei' for the random words.

    uint64 private immutable i_subscriptionId; // for funding requests through Chainlink account. It doesn't need to be a 'uint256', a 'uint64' would suffice.

    uint16 private constant REQUEST_CONFIRMATIONS = 3; // no. of confirmations the Chainlink node should wait before responding.

    uint32 private immutable i_callbackGasLimit; //how much gas to use for the callback request to our contract's fulfillRandomWords() function. Puts a limit to how much computational our fulfillRandomWords() function can be.

    uint32 private constant NUM_WORDS = 1; // How many random number you want.

    // EVENTS
    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId); // To emit the 'request ID'

    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2); // saving the address 'vrfCoordinatorV2' to our state variable 'i_vrfCoordinator', after typecasting it as 'VRFCoordinatorV2Interface'.
        i_gasLane = gasLane; //adding
        i_subscriptionId = subscriptionId; //adding
        i_callbackGasLimit = callbackGasLimit; //adding
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughEthEntered();
        }
        s_players.push(payable(msg.sender));

        emit RaffleEnter(msg.sender);
    }

    //* The Request
    // This will take a number of parameters. You can check the original 'VRFConsumerBaseV2' contract for them. This function returns a 'requestId' so we'll save it in a 'uint256 requestId', which contains info about which Chainlink account is requesting this info.
    function requestRandomWinner() external {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, //keyhash, depending on chain
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestedRaffleWinner(requestId); // we need to emit 'requestId' in an event.
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {}

    // GETTERS
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
