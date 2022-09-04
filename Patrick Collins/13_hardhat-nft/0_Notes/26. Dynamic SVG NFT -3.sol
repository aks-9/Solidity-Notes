//* 26. Dynamic SVG NFT -3

// This is 'DynamicSvgNft.sol' file.abi

//* Creating an NFT Token URI On-Chain
// Now that we can get a hash for our SVG image from 'svgToImageURI' function, we need to stick it into our JSON metadata. Once that is done, we will encode of this new JSON Metadata with base64, and that is going to be our final URI that our token will use.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import 'base64-sol/base64.sol';

contract DynamicSvgNft is ERC721 {
    uint256 private s_tokenCounter;
    string private s_lowImageURI;
    string private s_highImageURI;
    string private constant base64EncodedPrefix = 'data:image/svg+xml;base64,';

    constructor(string memory lowSvg, string memory highSvg)
        ERC721('Dynamic SVG NFT', 'DSN')
    {
        s_tokenCounter = 0;
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

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
    }

    // overriding the orignal function from ERC721
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), 'URI query for a non-existant token.');
        string memory imageURI = 'hi';

        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                // using single quotes here, as inside we have to use double quotes.
                                '{"name":"',
                                name(), //function from ERC721. Put a comma before and after it, and then put it in '', and then in "". This is because we're concatenating strings here.
                                '", "description":"An NFT that changes based on the Chainlink Feed", ',
                                '"attributes": [{"trait_type": "coolness", "value": 100}], "image":"',
                                imageURI,
                                '"}'
                            )
                        ) // Typecasting it into bytes by wrapping it in 'bytes()' function.
                    ) // And then encoding it into a base64 hash using 'Base64.encode()' function.
                    // Remember, we only have the base64 hash of the Metadata now, to get the Metadata we have to use the "data:application/json;base64," before this, which is similar to 'base64EncodedPrefix', but differs only in terms of type of file we're encoding.

                    // Prefix for JSON: data:application/json;base64,
                    // Prefix for SVG:  data:image/svg+xml;base64,

                    // We will therefore use a function from ERC721 called '_baseURI', and override it, to get the prefix for JSON.

                    // And now we'll concatenate the '_baseURI' and our Metadata's base64 hash, we'll again use 'abi.encodePacked' and pass '_baseURI() and whatever is returned from 'Base64.encode()'._baseURI
                )
            ); //* Typecasting it finally as a string.

        //! NOTE: We don't have to make this so complicated, this is to save gas. We can also do this step by step to avoid any confusion of calling the functions within functions, within functions.
    }

    //* To get the prefix for JSON.
    function _baseURI() internal pure override returns (string memory) {
        return 'data:application/json;base64,';
    }
}
