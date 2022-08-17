//* Frontend JS vs Node JS -3

// Node JS - reuire()
// Frontend JS - import()

// This is 'index.js' file.

import { ethers } from './ethers-5.6.esm.min.js'; //importing our local ethers library.

const connectButton = document.getElementById('connectButton'); // creating button here instead of 'index.html'
const fundButton = document.getElementById('fundButton'); // creating button here instead of 'index.html'

connectButton.onclick = connect();
fundButton.onclick = fund();

console.log(ethers); // logging ethers

async function connect() {
  if (typeof window.ethereum !== undefined) {
    console.log('Metamask is installed');
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log('connected to Metamask');

    //document.getElementById('connectButton').innerHTML = 'Connected!';
    connectButton.innerHTML = 'Connected!'; //refactoring
  } else {
    console.log('Metamask not installed...');

    //document.getElementById('connectButton').innerHTML = ('Please install Metamask!');
    fundButton.innerHTML = 'Please install Metamask!'; //refactoring
  }
}

async function fund(ethAmount) {
  console.log(`Funding with ${ethAmount}....`);

  if (typeof window.ethereum !== 'undefined') {
  }
}
