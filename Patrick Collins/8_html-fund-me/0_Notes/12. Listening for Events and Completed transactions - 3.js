//* Listening for Events and Completed transactions - 3

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
      await listenForTransactionMine(transactionResponse, provider); // waits for promise to be resolved.
      console.log('Done!'); // logging
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  /* 
  We're going to make our code such that 'provider.once()' will return a promise. We want to wait for the listner to finish listening. So we will wrap 'provider.once()' in a promise.

  A promise takes an anonymous arrow function itself as an input parameter. The anonymous arrow function will take two arguments, 'resolve' and 'reject'.

  If this promise works correctly, call this 'resolve' function. And for us, this promise is going to be done, when the listner finishes listening.

  We will 'reject' if there is some timeout. We're not going to write this function for now.
  
  */

  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations. `
      );
      resolve(); // We're going to 'resolve' this promise only when 'transactionResponse' gets fired.

      /* 
      So we're saying once this 'transactionResponse.hash' is found, then we're going to call this function:

    (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations. `
      );
      resolve(); 
    }

    And then we're going to call 'resolve', as a promise only returns when a 'resolve' or 'reject' is called. And we're telling it to only resolve, once the transaction hash is found.

     */
    });
  });
}

/*
Now if you go to the frontend, and click on 'fund' button:

we'll get the proper sequence:

Funding with 0.1...
index.js:44 Mining 0xaf63c38868e05c2c072a1282ca931a0e3cdbc0c032760df2ef01cbe4ce8009c4
index.js:58 Completed with 1 confirmations. 
index.js:36 Done!
*/
