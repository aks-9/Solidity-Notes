//* 7. IPFS hosted NFT -4

// This is 'RandomIpfsNft.sol' file.

//* Selecting the dog breed based on modded random number.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';
import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

// Custom errors
error RandomIpfsNft__RangeOutOfBounds(); // if something goes wrong while selecting the dog breed.

contract RandomIpfsNft is VRFConsumerBaseV2, ERC721 {
    // Types
    enum Breed {
        PUG,
        SHIBA_INU,
        ST_BERNARD
    } // Using 'enum' for deciding the breed of the dog.

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
    uint256 internal constant MAX_CHANCE_VALUE = 100;

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
        // _safeMint(dogOwner, newTokenId);

        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;

        Breed dogBreed = getBreedFromModdedRng(moddedRng); //calling the function to select the dog breed.
        _safeMint(dogOwner, newItemId); //minting
    }

    // To get the breed of the dog. It takes a uint 'moddedRng' as input and will return a 'enum'(0,1,2) which will help us select a breed from 'enum' Breed.
    function getBreedFromModdedRng(uint256 moddedRng)
        public
        pure
        returns (Breed)
    {
        uint256[3] memory chanceArray = getChanceArray(); // getting the chance array. Notice we'd to define an array of exact same size in memory.

        uint256 cumulativeSum = 0; // letting it to be 0

        for (uint256 i = 0; i < chanceArray.length; i++) {
            if (moddedRng >= cumulativeSum && moddedRng < chanceArray[i]) {
                return Breed(i);
            }

            cumulativeSum = chanceArray[i];

            /*
            * This is a cleverly written code. Need to focus.

            Let's say our 'moddedRng' is 25. It is less than 30, which means that our dog breed should be a SHIBA, as shiba has a 30% chance.

            
            When the loop runs for the first time, index 'i' is equal to '0', and at zeroth index of 'chanceArray' is 10

            So in the 'if' statement, 25 >= 0 and 25 < 10, 
            which will be false, as 25 is not less than 10. So we will skip the 'if' block now.

            Now we'll set the 'cumulativeSum' equal to 10.

            Loop runs again, with i=1. So now the '1' index of 'chanceArray' is 30.
            So in the 'if' statement, 25 > 10 and 25 < 30, 
            this will be true, and we'll get our Breed, which will be the enum at the the first index, which is a SHIBA.
            
            
            * Now we can go to 'fulfillRandomWords' function and call this function from there.
            
             */
        }

        revert RandomIpfsNft__RangeOutOfBounds(); //throwing custom error if this function doesn't return a Breed after running the above 'for' loop.
    }

    function getChanceArray() public pure returns (uint256[3] memory) {
        return [10, 30, MAX_CHANCE_VALUE];
    }

    function tokenURI(uint256) public view override returns (string memory) {}
}
