//* 21. Dynamic SVG NFT -2

// This is 'DynamicSvgNft.sol' file.abi

//* Base 64 Encoding

// By default, the SVG image data is in 'XML' format, but we need it in a 'hash' form, so it can be used as a token uri. So we will convert the 'SVG' into a 'base64' encoded format.
//* https://base64.guru/converter/encode/image/svg

// Base64 is a group of binary-to-text encoding schemes that represent binary data  that can be represented by Base64 digits.
// Then we can prefix that 'base64' encoded data with "data:image/svg+xml;base64," and paste it in browser, and it will give us our image.

// To convert the raw SVG to base64, we'll use an npm package:
// https://www.npmjs.com/package/base64-sol/v/1.0.1

// yarn add --dev base64-sol
// now import it.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import 'base64-sol/base64.sol'; // importing

contract DynamicSvgNft is ERC721 {
    uint256 private s_tokenCounter;
    string private s_lowImageURI; // adding
    string private s_highImageURI; // adding
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
        // using 'Base64.encode()' from 'base64.sol' to encode the SVG. It takes the output of typecasting a few more functions, as its input.
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(svg)))
        );

        return string(abi.encodePacked(base64EncodedPrefix, svgBase64Encoded)); // concatenating the two strings 'base64EncodedPrefix' and 'svgBase64Encoded'.
    }

    function mintNft(int256 highValue) public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
    }
}
