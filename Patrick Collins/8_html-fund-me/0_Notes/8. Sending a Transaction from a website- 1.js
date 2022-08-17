//* Sending a Transaction from a website- 1

// This is 'index.js' file.

import { ethers } from './ethers-5.6.esm.min.js';
import { abi, contractAddress } from './constants.js'; //importing

const connectButton = document.getElementById('connectButton');
const fundButton = document.getElementById('fundButton');

connectButton.onclick = connect();
fundButton.onclick = fund();

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

async function fund(ethAmount) {
  console.log(`Funding with ${ethAmount}....`);

  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum); // 'Web3Provider' is an object in 'ethers' that allows us to wrap around stuff like Metamask. It is really similar to that 'JsonRpcProvider' which we've used earlier to put our Alchemy/Infura node endpoint. In case of Metamask, the endpoints are in defined in its network section. This 'Web3Provider' takes that 'http' endpoint, and stick it in 'ethers' for us.

    // Since our provider is connected to Metamask, we can get a signer/wallet by following code:
    const signer = provider.getSigner(); // This is going to return the wallet connected to the provider, which in this case is Metamask.

    // console.log(signer);

    // We need ABI of the compiled contracts. So 'cd' into 'backend' folder and complie the contracts if not already done. Go to folder 'backend/artifacts/contracts/FundMe.sol/FundMe.dbg.json' file, and copy the ABI.

    // Back in the frontend, create a new file called 'constants', and paste the ABI into it, and export it.

    // Now 'cd' into backend again, run 'yarn hardhat node'. Copy the address of 'FundMe' and back in 'frontend' paste it into the 'constants.js' file, and export it.

    // import the 'contractAddress' from 'constants.js' file into our 'index.js' file.

    const contract = new ethers.Contract(contractAddress, abi, signer); // creating a contract object connected with 'signer'

    //* CREATING A TRANSACTION
    const transactionResponse = await contract.fund({
      value: ethers.utils.parseEther(ethAmount),
    });
  }
}

/*

! This will still give us an error, as we're not connected to the local hardhat node. In the next lesson, we'll add local hardhat node in our Metamask.

*/
