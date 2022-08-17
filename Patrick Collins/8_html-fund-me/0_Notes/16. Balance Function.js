//* Balance Function.

// Add a function to get balance.

// This is 'index.js' file.

import { ethers } from './ethers-5.6.esm.min.js';
import { abi, contractAddress } from './constants.js';

const connectButton = document.getElementById('connectButton');
const fundButton = document.getElementById('fundButton');
const balanceButton = document.getElementById('balanceButton'); // adding

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance; // adding

async function connect() {
  if (typeof window.ethereum !== undefined) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    connectButton.innerHTML = 'Connected!';
  } else {
    fundButton.innerHTML = 'Please install Metamask!';
  }
}

async function fund() {
  const ethAmount = document.getElementById('ethAmount').value;

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

async function getBalance() {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum); // creating a provider
    try {
      const balance = await provider.getBalance(contractAddress); //calling 'getBalance' function using 'provider'
      console.log(ethers.utils.formatEther(balance)); // 'formatEther' makes 'ethers' formatted numbers easier to read.
    } catch (error) {
      console.log(error);
    }
  } else {
    balanceButton.innerHTML = 'Please install MetaMask';
  }
}

/*

index.js:66 2.3
index.js:30 Funding with 1...
index.js:49 Mining 0xd092623abf1d2dc7160fbb85c68faac50b5ea20606b1eda1e59f75b03ff2900c
index.js:53 Completed with 1 confirmations. 
index.js:41 Done!
index.js:66 3.3

*/
