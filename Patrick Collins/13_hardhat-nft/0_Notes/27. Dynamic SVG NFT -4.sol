//* 27. Dynamic SVG NFT -4

// This is 'DynamicSvgNft.sol' file.abi

//* 27. Making the NFT Dynamic

// So when the price of the NFT is higher than a 'certain price point', we want our NFT to show a 'happy' face image, and when the price is lower than that certain point, we want out NFT to show a 'frown' face image.

// To achieve this, we will use Chainlink price feed. We will call the 'AggregatorV3' contract using its interface we import.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import 'base64-sol/base64.sol';
import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol'; // importing

contract DynamicSvgNft is ERC721 {
    uint256 private s_tokenCounter;
    string private s_lowImageURI;
    string private s_highImageURI;
    string private constant base64EncodedPrefix = 'data:image/svg+xml;base64,';

    AggregatorV3Interface internal immutable i_priceFeed; // to store our price feed address

    mapping(uint256 => int256) private s_tokenIdToHighValues; // mapping to compare against the price point, above which we'll show high SVG's image.

    event CreatedNFT(uint256 indexed tokenId, int256 highValue); // to be emitted at the time of minting.

    constructor(
        address priceFeedAddress, // price feed address to be passed at the deployment.
        string memory lowSvg,
        string memory highSvg
    ) ERC721('Dynamic SVG NFT', 'DSN') {
        s_tokenCounter = 0;
        s_lowImageURI = svgToImageURI(lowSvg); // calling the function that converts the passed 'lowSvg' image, to the encoded image uri, and saving to our state variable.
        s_highImageURI = svgToImageURI(highSvg); // calling the function that converts the passed 'highSvg' image, to the encoded image uri, and saving to our state variable.

        // Now when somebody calls the 'tokenURI' function, we'll update the update the images URI in our Metadata based on the price point. For this we need to know the price of the ETH / USD, so we'll use Chainlink data feed for that.

        // Install Chainlink contracts: yarn add --dev @chainlink/contracts
        // then import the interface of the price feed contract (AggregatorV3) at the top of this contract.

        i_priceFeed = AggregatorV3Interface(priceFeedAddress); // setting the price feed address
    }

    function svgToImageURI(string memory svg)
        public
        pure
        returns (string memory)
    {
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(svg)))
        );

        return string(abi.encodePacked(base64EncodedPrefix, svgBase64Encoded));
    }

    // We'll let the minter decide what should be that certain price point, above which the NFT will show the image at high SVG's URI.
    // Notice we're using 'int256' and not 'uint256' here, since we want to be able to compare it with 'price' variable returned by calling the price feed contract which is also an 'int256'.
    function mintNft(
        int256 highValue /* price point */
    ) public {
        s_tokenIdToHighValues[s_tokenCounter] = highValue; // setting the price point

        s_tokenCounter = s_tokenCounter + 1; // it's best practice to update the token counter before the minting of NFT to avoid any attack. //! This was giving error, so in the final contract we'll move it after minting function

        _safeMint(msg.sender, s_tokenCounter);
        // s_tokenCounter = s_tokenCounter + 1;

        emit CreatedNFT(s_tokenCounter, highValue); // event emitted.
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), 'URI query for a non-existant token.');
        // string memory imageURI = 'hi';

        //* GETTING THE PRICE POINT FROM OUR PRICE FEED CONTRACT
        (, int256 price, , , ) = i_priceFeed.latestRoundData(); // Only extracting 'price' from all the values returned from calling the function 'latestRoundData' on our price feed contract. //! Notice this is an 'int256'

        //? LOGIC
        string memory imageURI = s_lowImageURI; // setting the image uri to low SVG's URI by default.

        // And if the 'price' is greater than the price point decided by minter in the mapping 's_tokenIdToHighValues' for this 'tokenId', we'll set it to high SVG's URI.
        if (price >= s_tokenIdToHighValues[tokenId]) {
            imageURI = s_highImageURI;
        }

        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name(),
                                '", "description":"An NFT that changes based on the Chainlink Feed", ',
                                '"attributes": [{"trait_type": "coolness", "value": 100}], "image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function _baseURI() internal pure override returns (string memory) {
        return 'data:application/json;base64,';
    }
}

// yarn hardhat compile
// Compiled 6 Solidity files successfully
// Done in 18.92s.
