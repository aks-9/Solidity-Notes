//* 6. IPFS hosted NFT -3

// This is 'RandomIpfsNft.sol' file.

//* Adding rarities using a 'chance' array.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';
import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract RandomIpfsNft is VRFConsumerBaseV2, ERC721 {
    // Chainlink VRF Variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // VRF Helpers
    mapping(uint256 => address) public s_requestIdToSender;

    // NFT Variable
    uint256 private s_tokenCounter;
    uint256 internal constant MAX_CHANCE_VALUE = 100; // adding the maximum value of the chance array.

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721('Random IPFS NFT', 'RIN') {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function requestNft() public returns (uint256 requestId) {
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        s_requestIdToSender[requestId] = msg.sender;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        address dogOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;
        _safeMint(dogOwner, newTokenId);

        // decide the dogbreed
        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE; // whatever random number we get will be at zeroth index of the array 'randomWords'. When we use 'modulo' operator on it with MAX_CHANCE_VALUE, the remainder will always be less than MAX_CHANCE_VALUE itself. So if MAX_CHANCE_VALUE = 100 then we'll always get a remainder less than 100. We call this remainder 'modded random number'.

        // 7 = PUG
        // 88 = St. Bernard
        // 45 = St. Bernard
        // 12 = Shiba

        // now create a function called 'getBreedFromModdedRng'
    }

    //* Chance Array
    function getChanceArray() public pure returns (uint256[3] memory) {
        // This will return an array of size of 3 elements only.
        return [10, 30, MAX_CHANCE_VALUE];
        // index 0 (PUG) has a 10% chance of happening.
        // index 1 (SHIBA) has a 30% chance of happening.
        // index 2 (St. Bernard) has a 60% chance of happening.
    }

    function tokenURI(uint256) public view override returns (string memory) {}
}
