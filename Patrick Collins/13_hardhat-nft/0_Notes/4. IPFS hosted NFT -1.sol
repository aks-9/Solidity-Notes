//* 4. IPFS hosted NFT -1

// create a new contract file 'RandomIpfsNft.sol' in the contracts folder.

// This is 'RandomIpfsNft.sol' file.

//* Whenever we mint an NFT, we will trigger an Chainlink VRF call to get a random number. Using this random number, we will get a random NFT. The NFT is going to be one of these:
//? Pug (super rare), Shiba ( medium rare), St. Bernard(pretty common).

//* Users have to pay to mint the NFT.abi
//* The owner of the contract can withdraw the ETH.

// install @chainlink/contracts: yarn add --dev @chainlink/contracts

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol'; //importing
import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol'; //importing

//Inheriting VRFConsumerBaseV2
contract RandomIpfsNft is VRFConsumerBaseV2 {
    // Chainlink VRF Variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator; // to store the address of VRF coordinator.
    uint64 private immutable i_subscriptionId; //adding
    bytes32 private immutable i_gasLane; //adding
    uint32 private immutable i_callbackGasLimit; //adding
    uint16 private constant REQUEST_CONFIRMATIONS = 3; //adding
    uint32 private constant NUM_WORDS = 1; //adding

    constructor(
        address vrfCoordinatorV2, //adding
        uint64 subscriptionId, //adding
        bytes32 gasLane, //adding
        uint32 callbackGasLimit //adding
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2); //adding
        i_gasLane = gasLane; //adding
        i_subscriptionId = subscriptionId; //adding
        i_callbackGasLimit = callbackGasLimit; //adding
    }

    // In order to request an NFT, we need to call 'requestRandomWords' function on our VRF coordinator contract.
    function requestNft() public returns (uint256 requestId) {
        //adding
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
    }

    // This is overriden from VRFConsumerBaseV2
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {}

    function tokenURI(uint256) public {}
}
