//* Frontend JS vs Node JS -1

// Node JS - reuire()
// Frontend JS - import()

// This is 'index.js' file.

import { ethers } from './ethers-5.6.esm.min.js'; //importing our local ethers library.

async function connect() {
  if (typeof window.ethereum !== undefined) {
    console.log('Metamask is installed');
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log('connected to Metamask');
    document.getElementById('connectButton').innerHTML = 'Connected!';
  } else {
    console.log('Metamask not installed...');
    document.getElementById('connectButton').innerHTML =
      'Please install Metamask!';
  }
}

async function fund(ethAmount) {
  console.log(`Funding with ${ethAmount}....`);

  if (typeof window.ethereum !== 'undefined') {
    /*
    * TO SEND A TRANSACTION, WE NEED:

    PROVIDER - connection to the blockchain.
    SIGNER / WALLET - someone with some gas.
    CONTRACT we're interacting with
     ^ ABI and address.

    To get our Provider, we'll work with 'ethers'. But instead of using Node modules, we'll copy the 'ethers' library to our own local directory and serve it ourselves.

    So go to https://cdn.ethers.io/lib/ethers-5.6.esm.min.js and copy the whole code shown in the page.

    create a new file 'ethers-5.6.esm.min.js' in the root directory and paste the copied 'ethers' library in it.

    Now we can import 'ethers' from this file to 'index.js' file.

    */
  }
}
