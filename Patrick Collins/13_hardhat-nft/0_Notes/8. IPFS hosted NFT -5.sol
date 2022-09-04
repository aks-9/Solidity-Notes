//* 8. IPFS hosted NFT -5

// This is 'RandomIpfsNft.sol' file.

//* Setting the NFT image

// In the ERC721, we have to override the 'tokenURI' function and set the token's URI ourselves. But we can also use 'ERC721URIStorage' contract from OpenZeppelin, which inherits from ERC721 and give us a function '_setTokenURI' to do the same thing eaisily.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';
import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
// import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol'; //importing

// Custom errors
error RandomIpfsNft__RangeOutOfBounds();

// inheriting from ERC721URIStorage instead of ERC721, but we can still use the constructor of ERC721 as ERC721URIStorage also inherits from ERC721.
contract RandomIpfsNft is VRFConsumerBaseV2, ERC721URIStorage {
    // Types
    enum Breed {
        PUG,
        SHIBA_INU,
        ST_BERNARD
    }

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
    string[] internal s_dogTokenUris; // adding. Each element of this array holds the URIs of all the tokens as a string. Each URI will point to Metadata of a token, from where we can get the respective 'image'. We can update the image of the NFT after deployment, by updating this.

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit,
        string[3] memory dogTokenUris // passing the token's URI while deployment.
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721('Random IPFS NFT', 'RIN') {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_dogTokenUris = dogTokenUris; // settin the token's URI.
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
        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;

        Breed dogBreed = getBreedFromModdedRng(moddedRng); //dogBreed will be an 'enum' (0,1,2)
        _safeMint(dogOwner, newTokenId);

        _setTokenURI(newTokenId, s_dogTokenUris[uint256(dogBreed)]); // setting the token's URI. This function takes, the 'tokenId' and the URI of that token as parameters. Also, typecasting it into 'uint' as 'dogBreed' is an 'enum'.
    }

    function getBreedFromModdedRng(uint256 moddedRng)
        public
        pure
        returns (Breed)
    {
        uint256[3] memory chanceArray = getChanceArray();

        uint256 cumulativeSum = 0;

        for (uint256 i = 0; i < chanceArray.length; i++) {
            if (moddedRng >= cumulativeSum && moddedRng < chanceArray[i]) {
                return Breed(i);
            }

            cumulativeSum = chanceArray[i];
        }

        revert RandomIpfsNft__RangeOutOfBounds();
    }

    function getChanceArray() public pure returns (uint256[3] memory) {
        return [10, 30, MAX_CHANCE_VALUE];
    }

    function tokenURI(uint256) public view override returns (string memory) {}
}
