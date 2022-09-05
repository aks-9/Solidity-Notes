//* 31. Dynamic SVG NFT - deploy script-3- minting

// create a new file in the 'deploy' folder, called '04-mint.js'

//* We will now add a mint functionality to mint each of our contract's NFTs.

// This is '04-mint.js' file.

const { network, ethers } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config');

module.exports = async ({ getNamedAccounts, deployments }) => {
    //* we're not going to deploy anthing here, so we don't need this
    // const { deploy, log } = deployments;

    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    //* Basic NFT
    const basicNft = await ethers.getContract('BasicNft', deployer);
    const basicMintTx = await basicNft.mintNft(); //calling the mint function.
    await basicMintTx.wait(1);
    console.log(`Basic NFT index 0 tokenURI: ${await basicNft.tokenURI(0)}`);

    //* Random IPFS NFT
    const randomIpfsNft = await ethers.getContract('RandomIpfsNft', deployer);

    const mintFee = await randomIpfsNft.getMintFee(); //getting mint fee

    //! Need to listen for response
    await new Promise(async (resolve, reject) => {
        setTimeout(
            () => reject("Timeout: 'NFTMinted' event did not fire"),
            300000
        ); // 5 minute timeout time

        // setup listener for our event
        randomIpfsNft.once('NftMinted', async () => {
            resolve();
        });

        const randomIpfsNftMintTx = await randomIpfsNft.requestNft({
            value: mintFee.toString(), //passing the value
        }); //calling the mint function.

        const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1);

        if (developmentChains.includes(network.name)) {
            const requestId =
                randomIpfsNftMintTxReceipt.events[1].args.requestId.toString();

            const vrfCoordinatorV2Mock = await ethers.getContract(
                'VRFCoordinatorV2Mock',
                deployer
            );

            await vrfCoordinatorV2Mock.fulfillRandomWords(
                requestId,
                randomIpfsNft.address
            );
        }
    });

    console.log(
        `Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`
    );

    //* Dynamic SVG  NFT
    const highValue = ethers.utils.parseEther('4000');
    const dynamicSvgNft = await ethers.getContract('DynamicSvgNft', deployer);
    const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue); //calling the mint function.
    await dynamicSvgNftMintTx.wait(1);

    console.log(
        `Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`
    );
};

module.exports.tags = ['all', 'mint'];

/*
yarn hardhat deploy

*OUTPUT:

Compiled 1 Solidity file successfully
Local network detected! Deploying mocks...
deploying "VRFCoordinatorV2Mock" (tx: 0xbf63d68a7a58b0f1156ed0116c1badaebbdeca55363b2306892c886e1680f041)...: deployed at 0xFD2Cf3b56a73c75A7535fFe44EBABe7723c64719 with 1803306 gas
deploying "MockV3Aggregator" (tx: 0xfcc58c86a090b4fcf29942852886c4e3b4477a748223c7a576f2dc82ceed88f6)...: deployed at 0xB22C255250d74B0ADD1bfB936676D2a299BF48Bd with 558433 gas
Mocks Deployed!
-----------------------------------------------------------------
----------------------------------------------------
deploying "BasicNft" (tx: 0x302ee64cba522008e2c1e8b1c939ea18f67b3d6e1dfac401a96c5fec98d730a6)...: deployed at 0x666D0c3da3dBc946D5128D06115bb4eed4595580 with 2020849 gas
----------------------------------------------------
deploying "RandomIpfsNft" (tx: 0x18ff6f2d03be60c566cfa6d10c08e7c74c08bfa60a6476f3b1d45118033682ef)...: deployed at 0xA9e6Bfa2BF53dE88FEb19761D9b2eE2e821bF1Bf with 3530085 gas
----------------------------------------------------
----------------------------------------------------
deploying "DynamicSvgNft" (tx: 0x42b35a0d50e37c844d4c40983511850bdef70a354c26a87d51e714104c738e01)...: deployed at 0x1E3b98102e19D3a164d239BdD190913C2F02E756 with 4266679 gas
Basic NFT index 0 tokenURI: ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json
Random IPFS NFT index 0 tokenURI: ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm
Dynamic SVG NFT index 0 tokenURI: data:application/json;base64,eyJuYW1lIjoiRHluYW1pYyBTVkcgTkZUIiwgImRlc2NyaXB0aW9uIjoiQW4gTkZUIHRoYXQgY2hhbmdlcyBiYXNlZCBvbiB0aGUgQ2hhaW5saW5rIEZlZWQiLCAiYXR0cmlidXRlcyI6IFt7InRyYWl0X3R5cGUiOiAiY29vbG5lc3MiLCAidmFsdWUiOiAxMDB9XSwgImltYWdlIjoiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQRDk0Yld3Z2RtVnljMmx2YmowaU1TNHdJaUJ6ZEdGdVpHRnNiMjVsUFNKdWJ5SS9QZ284YzNabklIZHBaSFJvUFNJeE1ESTBjSGdpSUdobGFXZG9kRDBpTVRBeU5IQjRJaUIyYVdWM1FtOTRQU0l3SURBZ01UQXlOQ0F4TURJMElpQjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaVBnb2dJRHh3WVhSb0lHWnBiR3c5SWlNek16TWlJR1E5SWswMU1USWdOalJETWpZMExqWWdOalFnTmpRZ01qWTBMallnTmpRZ05URXljekl3TUM0MklEUTBPQ0EwTkRnZ05EUTRJRFEwT0MweU1EQXVOaUEwTkRndE5EUTRVemMxT1M0MElEWTBJRFV4TWlBMk5IcHRNQ0E0TWpCakxUSXdOUzQwSURBdE16Y3lMVEUyTmk0MkxUTTNNaTB6TnpKek1UWTJMall0TXpjeUlETTNNaTB6TnpJZ016Y3lJREUyTmk0MklETTNNaUF6TnpJdE1UWTJMallnTXpjeUxUTTNNaUF6TnpKNklpOCtDaUFnUEhCaGRHZ2dabWxzYkQwaUkwVTJSVFpGTmlJZ1pEMGlUVFV4TWlBeE5EQmpMVEl3TlM0MElEQXRNemN5SURFMk5pNDJMVE0zTWlBek56SnpNVFkyTGpZZ016Y3lJRE0zTWlBek56SWdNemN5TFRFMk5pNDJJRE0zTWkwek56SXRNVFkyTGpZdE16Y3lMVE0zTWkwek56SjZUVEk0T0NBME1qRmhORGd1TURFZ05EZ3VNREVnTUNBd0lERWdPVFlnTUNBME9DNHdNU0EwT0M0d01TQXdJREFnTVMwNU5pQXdlbTB6TnpZZ01qY3lhQzAwT0M0eFl5MDBMaklnTUMwM0xqZ3RNeTR5TFRndU1TMDNMalJETmpBMElEWXpOaTR4SURVMk1pNDFJRFU1TnlBMU1USWdOVGszY3kwNU1pNHhJRE01TGpFdE9UVXVPQ0E0T0M0Mll5MHVNeUEwTGpJdE15NDVJRGN1TkMwNExqRWdOeTQwU0RNMk1HRTRJRGdnTUNBd0lERXRPQzA0TGpSak5DNDBMVGcwTGpNZ056UXVOUzB4TlRFdU5pQXhOakF0TVRVeExqWnpNVFUxTGpZZ05qY3VNeUF4TmpBZ01UVXhMalpoT0NBNElEQWdNQ0F4TFRnZ09DNDBlbTB5TkMweU1qUmhORGd1TURFZ05EZ3VNREVnTUNBd0lERWdNQzA1TmlBME9DNHdNU0EwT0M0d01TQXdJREFnTVNBd0lEazJlaUl2UGdvZ0lEeHdZWFJvSUdacGJHdzlJaU16TXpNaUlHUTlJazB5T0RnZ05ESXhZVFE0SURRNElEQWdNU0F3SURrMklEQWdORGdnTkRnZ01DQXhJREF0T1RZZ01IcHRNakkwSURFeE1tTXRPRFV1TlNBd0xURTFOUzQySURZM0xqTXRNVFl3SURFMU1TNDJZVGdnT0NBd0lEQWdNQ0E0SURndU5HZzBPQzR4WXpRdU1pQXdJRGN1T0MwekxqSWdPQzR4TFRjdU5DQXpMamN0TkRrdU5TQTBOUzR6TFRnNExqWWdPVFV1T0MwNE9DNDJjemt5SURNNUxqRWdPVFV1T0NBNE9DNDJZeTR6SURRdU1pQXpMamtnTnk0MElEZ3VNU0EzTGpSSU5qWTBZVGdnT0NBd0lEQWdNQ0E0TFRndU5FTTJOamN1TmlBMk1EQXVNeUExT1RjdU5TQTFNek1nTlRFeUlEVXpNM3B0TVRJNExURXhNbUUwT0NBME9DQXdJREVnTUNBNU5pQXdJRFE0SURRNElEQWdNU0F3TFRrMklEQjZJaTgrQ2p3dmMzWm5QZ289In0=
Done in 31.04s.


*/
