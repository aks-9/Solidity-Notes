//* Listening for Events and Completed transactions - 1

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

      // We have a 'transactionResponse' here, and we want our frontend to tell the user that the transaction went through. So we want to listen to the blockchain for this to finish. So we will create a function to do this. This is not going to be an 'async' function, as we're going to use the 'promise' functionality here, and have this function return a 'promise'.

      /* 
      
      Returning a promise, so as to create a 'listener' to the blockchain. In our 'fund' function, after we create a transaction, we want to tell JavaScript to wait for transaction to finish. So we will just add the following await statement in our 'fund' function: 
      
      await listenForTransactionMine(transactionResponse, provider);
      
      */

      await listenForTransactionMine(transactionResponse, provider); // execution waits here for 'listenForTransactionMine' to finish first.
    } catch (error) {
      console.log(error);
    }
  }
}

// Not an 'async' function. This is a promise based function.
function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`); // all of our 'transactionResponse' objects has a 'hash'.

  // Creating a listner. Listening for the transaction to be finished. Using 'provider.once' function from 'ethers', where the first argument is the 'event' we're listening to happen, and then once that event happens, we call the arrow function passed in the second argument.

  // One of the events that we can wait for, is to 'transactionReceipt' to finish. Because once we get a 'transactionReceipt' that means the 'transaction' has finished going through.
  // So we're going ues this 'provider.once(event, listner)' syntax, to wait for 'transactionReceipt', which is going to be our 'event' here, and then we call some 'listner' function we define.
  // The listner funcion is going to be an anonymous arrow function.
  // So once this 'transactionResponse' finishes, we're going to take 'transactionReceipt' as an input parameter in our anonymous arrow function.
  provider.once(transactionResponse.hash, (transactionReceipt) => {
    console.log(
      `Completed with ${transactionReceipt.confirmations} confirmations. `
    ); // '.confirmations' tells us how many block confirmation it has.
  });
}

/*
Now if you go to the frontend and click on 'fund' button:

Funding with 0.1...
index.js:42 Mining 0x6ac80e2ca8abb523ede6bf41a1288d22187a5ab40939d88284ee20a432395cbe
index.js:57 Completed with 1 confirmations. 

It will work.

==> In case of error make sure you've not restarted the hardhat node. If you have, go to Metamask's advanced account settings, and reset the account.
*/
