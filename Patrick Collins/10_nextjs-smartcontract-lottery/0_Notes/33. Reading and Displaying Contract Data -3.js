//* 33. Reading and Displaying Contract Data -3

// We are still not getting 'recent winner' on our front end. So in the backend, we'll creaet a new script in the 'scripts' folder, called mockOffchain.js. This will both act as mock VRF and keepers to simulate chaoosing a recent winner.

// This is 'backend/scripts/mockOffchain.js' file.

const { ethers, network } = require('hardhat');

async function mockKeepers() {
  const raffle = await ethers.getContract('Raffle');
  const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(''));
  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep(checkData);
  if (upkeepNeeded) {
    const tx = await raffle.performUpkeep(checkData);
    const txReceipt = await tx.wait(1);
    const requestId = txReceipt.events[1].args.requestId;
    console.log(`Performed upkeep with RequestId: ${requestId}`);
    if (network.config.chainId == 31337) {
      await mockVrf(requestId, raffle);
    }
  } else {
    console.log('No upkeep needed!');
  }
}

async function mockVrf(requestId, raffle) {
  console.log("We on a local network? Ok let's pretend...");
  const vrfCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock');
  await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address);
  console.log('Responded!');
  const recentWinner = await raffle.getRecentWinner();
  console.log(`The winner is: ${recentWinner}`);
}

mockKeepers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/*
* Add this to 'hardhat.config.js'

localhost: {
            chainId: 31337,
        },



! Make sure to 'cd' into your backend folder in a seperate terminal, run the 'yarn hardhat node' and let it run.

* Then open a new terminal, 'cd' into frontend folder, and run 'yarn run dev'
* Open the server at http://localhost:3000/
* Make sure to reset your Metamask account.
* Create at least 3 transactions by clicking 'Enter Raffle' button and approving Metamask popup.

! Then come back in your VS code, and create a third terminal, 'cd' into backend folder, and now run the 'mockOffchain' script:

* yarn hardhat run scripts/mockOffchain.js --network localhost


*OUTPUT:

Performed upkeep with RequestId: 1
We on a local network? Ok let's pretend...
Responded!
The winner is: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Done in 4.23s.

* You'll have to refresh the frontend for the winner to be shown there.


*/
