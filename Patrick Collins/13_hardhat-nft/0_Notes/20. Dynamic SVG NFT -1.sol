//* 20. Dynamic SVG NFT -1

// create a new contract called 'DynamicSvgNft.sol', in the 'contracts' folder.

// This is 'DynamicSvgNft.sol' file.abi

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract DynamicSvgNft is ERC721 {
    // 1. mint
    // 2. store our SVG information somewhere
    // 3. some logic to say 'show X image' or 'show Y image'.

    uint256 private s_tokenCounter;

    constructor(string memory lowSvg, string memory highSvg)
        ERC721('Dynamic SVG NFT', 'DSN')
    {
        s_tokenCounter = 0;
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1; // increment
    }
}
