//* 9. IPFS hosted NFT -6

// This is 'RandomIpfsNft.sol' file.

//* Setting an NFT Mint Price, allowing owner to withdraw.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';
import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol'; //importing

// Custom errors
error RandomIpfsNft__RangeOutOfBounds();
error RandomIpfsNft__NeedMoreETHSent(); //adding
error RandomIpfsNft__TransferFailed(); //adding

// inheriting from the Ownable contract to use access control modifiers.
contract RandomIpfsNft is VRFConsumerBaseV2, ERC721URIStorage, Ownable {
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

    // Events
    event NftRequested(uint256 indexed requestId, address requester); //adding
    event NftMinted(Breed breed, address minter); //adding

    // NFT Variable
    uint256 private s_tokenCounter;
    uint256 internal constant MAX_CHANCE_VALUE = 100;
    string[] internal s_dogTokenUris;
    uint256 private immutable i_mintFee; // this will tell how much buyer has to pay to mint an NFT.

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit,
        string[3] memory dogTokenUris,
        uint256 mintFee // taking input before deployment.
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721('Random IPFS NFT', 'RIN') {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_dogTokenUris = dogTokenUris;
        i_mintFee = mintFee; // setting at deployment.
    }

    // Making this a payable function
    function requestNft() public payable returns (uint256 requestId) {
        // checking if buyer has sent enough money to buy the NFT
        if (msg.value < i_mintFee) {
            revert RandomIpfsNft__NeedMoreETHSent(); // custom error.
        }

        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requestIdToSender[requestId] = msg.sender;

        emit NftRequested(requestId, msg.sender); // emitting event
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        address dogOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;
        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;

        Breed dogBreed = getBreedFromModdedRng(moddedRng);
        s_tokenCounter = s_tokenCounter + 1;
        _safeMint(dogOwner, newTokenId);
        _setTokenURI(newTokenId, s_dogTokenUris[uint256(dogBreed)]);

        emit NftMinted(dogBreed, dogOwner); //emitting event
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

    // To let the owner of this contract withdraw ETH.
    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance; //getting balance of this contract
        (bool success, ) = payable(msg.sender).call{value: amount}(''); //sending money to the caller of this function, which can only be the owner.

        // require(success, 'Transfer failed');
        if (!success) {
            revert RandomIpfsNft__TransferFailed(); // As we're using 'call' method, we need to check if transaction was successful or not.
        }
    }

    //* GETTER FUNCTIONS
    function getChanceArray() public pure returns (uint256[3] memory) {
        return [10, 30, MAX_CHANCE_VALUE];
    }

    // function tokenURI(uint256) public view override returns (string memory) {}
    // we don't need this as we're using '_setTokenURI' function.

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    } // ADDING

    function getDogTokenUris(uint256 index)
        public
        view
        returns (string memory)
    {
        return s_dogTokenUris[index];
    } // ADDING

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    } // ADDING
}
