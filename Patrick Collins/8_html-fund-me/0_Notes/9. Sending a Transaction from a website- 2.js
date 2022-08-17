//* Sending a Transaction from a website- 2

// This is 'index.js' file.

/*
Go to Metamsk > Add network >

Name - Hardhat-Localhost

RPC url- http://127.0.0.1:8545/  //From the local node we're still running.

chainID - 31337

Currency - ETH

-----------------------------------------------------------------

* Import the local node account into Metamask
Copy the private key, go to the Metamask account, click import, then paste the key and import.
*/

import { ethers } from './ethers-5.6.esm.min.js';
import { abi, contractAddress } from './constants.js';

const connectButton = document.getElementById('connectButton');
const fundButton = document.getElementById('fundButton');

connectButton.onclick = connect;
fundButton.onclick = fund;

console.log(ethers);

async function connect() {
  if (typeof window.ethereum !== undefined) {
    console.log('Metamask is installed');
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log('connected to Metamask');
    connectButton.innerHTML = 'Connected!';
  } else {
    console.log('Metamask not installed...');
    fundButton.innerHTML = 'Please install Metamask!';
  }
}

async function fund() {
  const ethAmount = '0.1';
  console.log(`Funding with ${ethAmount}....`);

  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // CREATING A TRANSACTION
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
    } catch (error) {
      console.log(error);
    }
  }
}

/*

Connect button is not popping up Metamask as of now. It only changes to 'connected' and does nothing else on Hardhat Localhost. It works on 'Rinkeby'.

*/
