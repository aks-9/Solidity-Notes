/*
ERC -721 : Non fungible Token standard. Unique token ID and owner.

ERC-1155 : Semi fungible NFT standard. Multiple / fractional ownership.

Token URI : Universally unique indicator of what an NFT would look like and what its attributes are.

We can use a centralized API or IPFS to get this URI. It returns a JSON object called Metadata:

{
    "name": "Name",
    "description": "Descripttion",
    "image": "URI",
    "attributes": []
}

The "URI" points to the image.

If you're looking to render an image of an NFT:
* 1. Add that image to IPFS
* 2. Add a metadata file, pointing to that image file on IPFS.
* 3. And grab that token URI, and set it as your NFT by adding the IPFS URI to your NFT URI.

https://blog.chain.link/build-deploy-and-sell-your-own-dynamic-nft/















*/