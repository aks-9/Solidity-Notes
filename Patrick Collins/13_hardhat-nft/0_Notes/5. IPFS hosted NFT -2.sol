//* 4. IPFS hosted NFT -2

// This is 'RandomIpfsNft.sol' file.

//* Mapping the Chainlink VRF requests ID

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';
import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol'; //importing

// install open zeppelin contracts:
// yarn add --dev @openzeppelin/contracts

contract RandomIpfsNft is VRFConsumerBaseV2, ERC721 {
    // Chainlink VRF Variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721('Random IPFS NFT', 'RIN') {
        //adding ERC721 constructor

        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    // People who call this 'requestNft' function will own the NFT. But this will trigger a random number request with a 'requestId', and then the Chainlink node will call our 'fulfillRandomWords' function and give us the random number along with 'requestId'.

    // But the 'safeMint' function takes 'msg.sender' as one of its arguments, so if we mind the NFT in the 'fulfillRandomWords' after we've got the random number, then the owner will be the Chainlink node and not the person who called 'requestNft'.

    // So we must to create a mapping between the 'requestId' and the person who called this 'requestNft' function and requested a random number in order to get an NFT. This mapping will be used to pass the address of the person who called 'requestNft' function, to the 'safeMint' function.

    //* VRF Helpers
    mapping(uint256 => address) public s_requestIdToSender; // adding

    // NFT Variable
    uint256 private s_tokenCounter; // to be passed in 'safeMint' function.

    function requestNft() public returns (uint256 requestId) {
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        s_requestIdToSender[requestId] = msg.sender; //saving the address of the person who called this function with 'requestId' in the mapping.
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        address dogOwner = s_requestIdToSender[requestId]; // setting the address at the 'requestId' in the mapping as the owner of the NFT to be minted.

        uint256 newTokenId = s_tokenCounter; // setting the token ID for NFT.abi

        _safeMint(dogOwner, newTokenId); // function from ERC721
    }

    // adding 'override', 'view' and returns(string memory)
    function tokenURI(uint256) public view override returns (string memory) {}
}
