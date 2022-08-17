//* Listening for Events and Completed transactions - 2

// This is 'index.js' file.

import { ethers } from './ethers-5.6.esm.min.js';
import { abi, contractAddress } from './constants.js';

const connectButton = document.getElementById('connectButton');
const fundButton = document.getElementById('fundButton');

connectButton.onclick = connect;
fundButton.onclick = fund;

async function connect() {
  if (typeof window.ethereum !== undefined) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    connectButton.innerHTML = 'Connected!';
  } else {
    fundButton.innerHTML = 'Please install Metamask!';
  }
}

async function fund() {
  const ethAmount = '0.1';
  console.log(`Funding with ${ethAmount}...`);
  if (typeof window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
      console.log('Done!'); // logging
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);

  provider.once(transactionResponse.hash, (transactionReceipt) => {
    console.log(
      `Completed with ${transactionReceipt.confirmations} confirmations. `
    );
  });
}

/*

* Now if we click on 'fund'

Funding with 0.1...
index.js:44 Mining 0x6b2525151ac93b6f2be0fab61a45d90731bb7dc7b547e25c8e1f8ada22457d04
index.js:36 Done!
index.js:47 Completed with 1 confirmations. 

== >  'Done!' should come last but it is coming before 'Completed with 1 confirmations. '

* This is because when we call 'listenForTransactionMine' function, it is going to start 'provider.once' as its own process.

So 'await listenForTransactionMine() is going to kick off a 'listner':

 provider.once(transactionResponse.hash, (transactionReceipt) => {
    console.log(
      `Completed with ${transactionReceipt.confirmations} confirmations. `
    );
  });


but it doesn't wait for this 'listner', to find the 'transactionResponse'. So 'listenForTransactionMine()' is going to finish before 'provider.once()' finishes.

So after kicking of 'provider.once()', the 'listenForTransactionMine()' is going to run the next line of our code, which is:

console.log('Done!');

Then our frontend will go back and check if the 'listner' has finished, and if it has, then it will do what the 'listner' says. 

This is where the event loop kicks in. We don't wait for 'provider.once()' to finish, we add it to 'queue' called the 'event loop'. And our frontend is going to periodically check if it is finished.

* So we want to refactor our code, such that we wait for the 'listner' to finish listening. Which is where we are going to use a Promise.
*/
