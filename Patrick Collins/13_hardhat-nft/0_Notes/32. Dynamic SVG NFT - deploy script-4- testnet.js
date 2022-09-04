//* 32. Dynamic SVG NFT - deploy script-4- testnet

//* We will try to deploy this a testnet.
// make sure we've a 'subscription ID' added in the 'helper-hardhat.config.js' file.
// And we shouldn't call the mint function, because we actually need to add the 'consumer' address first before we can actually mint.

// So we'll deploy all of our contracts, but before we can mint for our IPFS NFT, we need to add that contract as a 'consumer'

//* yarn hardhat deploy --network rinkeby --tags main
// Now this won't mint any of our NFTs. It will just deploy those contracts.
/*
OUPUT:
Nothing to compile
----------------------------------------------------
deploying "BasicNft" (tx: 0xdc24d6abdb3bd44b1997e6f717afe0c434f5897b7ff275a64de856e47d04596b)...: deployed at 0x0603A2dBeCFE62293f4F9eeBB96d6d0342ae2641 with 2020849 gas
Verifying...
Verifying contract...
Nothing to compile
Warning: Function state mutability can be restricted to pure
  --> contracts/BasicNFT.sol:31:5:
   |
31 |     function tokenURI(
   |     ^ (Relevant source part starts here and spans across multiple lines).


Successfully submitted source code for contract
contracts/BasicNFT.sol:BasicNft at 0x0603A2dBeCFE62293f4F9eeBB96d6d0342ae2641
for verification on the block explorer. Waiting for verification result...

Successfully verified contract BasicNft on Etherscan.
https://rinkeby.etherscan.io/address/0x0603A2dBeCFE62293f4F9eeBB96d6d0342ae2641#code
----------------------------------------------------
deploying "RandomIpfsNft" (tx: 0x68b4b4630a6c24fe6baaddebb4824715ba73ac55fe0e82acc70ffe1e3f4b4e6e)...: deployed at 0xE66475a684fD52721B368fC7bB7d0c48dbA0BB5D with 3530097 gas
----------------------------------------------------
Verifying...
Verifying contract...
Nothing to compile
Successfully submitted source code for contract
contracts/RandomIpfsNft.sol:RandomIpfsNft at 0xE66475a684fD52721B368fC7bB7d0c48dbA0BB5D
for verification on the block explorer. Waiting for verification result...

Successfully verified contract RandomIpfsNft on Etherscan.
https://rinkeby.etherscan.io/address/0xE66475a684fD52721B368fC7bB7d0c48dbA0BB5D#code
----------------------------------------------------
deploying "DynamicSvgNft" (tx: 0x39e66e38ea357e31338ab3d57a134e8d7c66925abec183c6be1826137d50aa91)...: deployed at 0xCE193003B11C26630087E2C00Edcc45AB6494cFe with 4266679 gas
Verifying...
Verifying contract...
Nothing to compile
Successfully submitted source code for contract
contracts/DynamicSvgNft.sol:DynamicSvgNft at 0xCE193003B11C26630087E2C00Edcc45AB6494cFe
for verification on the block explorer. Waiting for verification result...

Successfully verified contract DynamicSvgNft on Etherscan.
https://rinkeby.etherscan.io/address/0xCE193003B11C26630087E2C00Edcc45AB6494cFe#code
Done in 151.65s.


*/

//* Once everything is deployed, go to 'https://vrf.chain.link' and add the 'randomIpfsNft' contract as a consumer.
// once our 'randomIpfsNft' contract is added as a consumer, we can mint 1 NFT from each of our contracts.

//* yarn hardhat deploy --network rinkeby --tags mint

// Now once we've minted, we can copy our deployed contract and go to testnets.opensea.io and paste it in the search bar. It should now show your NFT. It could take some hours for Opensea to register our NFT from testnet.
