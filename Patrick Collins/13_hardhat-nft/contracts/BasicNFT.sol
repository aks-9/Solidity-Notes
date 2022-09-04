//* 3. Basic NFT -1

// This is 'BasicNFT.sol' file.

// * Create a new folder 'contracts'. Create a new file 'BasicNFT.sol' in it.
// Install Open Zep: yarn add --dev @openzeppelin/contracts

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol'; //importing

// Inheriting from ERC721, whose constructor takes a 'name' and a 'symbol'.
contract BasicNft is ERC721 {
    string public constant TOKEN_URI =
        'ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json'; // Token URI from IPFS. This returns a JSON object, which is Metadata for our NFT, and in that metadata we have our image URI to points to the image of the NFT.

    uint256 private s_tokenCounter; // to count token ID

    constructor() ERC721('Dogie', 'DOG') {
        s_tokenCounter = 0;
    }

    function mintNft() public returns (uint256) {
        _safeMint(msg.sender, s_tokenCounter); // calling the mint function of ERC721 contract. It takes an address 'to' who will own the NFT and a 'tokenID'.
        s_tokenCounter = s_tokenCounter + 1; // incrementing the token ID.
        return s_tokenCounter;
    }

    // This function overrides the original 'tokenURI' function in ERC721 contract
    function tokenURI(
        uint256 /*tokenId*/
    ) public view override returns (string memory) {
        return TOKEN_URI;
    }

    // GETTER
    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
