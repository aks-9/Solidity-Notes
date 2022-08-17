//* Input Forms-2

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
  const ethAmount = document.getElementById('ethAmount').value; //getting value from the HTML element with id= "ethAmount"

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

  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations. `
      );
      resolve();
    });
  });
}

/*

Funding with 1.7...
index.js:45 Mining 0xcf518898e889295092f2688e0f08bd9276bd0ad35525238c1b70828f034c96a5
index.js:49 Completed with 1 confirmations. 
index.js:37 Done!

*/
