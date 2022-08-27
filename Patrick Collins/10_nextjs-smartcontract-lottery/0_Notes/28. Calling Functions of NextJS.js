// * 28. Calling Functions of NextJS

// This is 'LotteyEntrance.js' file.

// * We want to add a button on frontend, to enter the lottery by calling 'enterRaffle' function of our contract.

import { useWeb3Contract } from 'react-moralis';
import { contractAddresses, abi } from '../constants';
import { useMoralis } from 'react-moralis';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [entranceFee, setEntranceFee] = useState('0');

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'enterRaffle',
    params: {},
    msgValue: entranceFee, // adding the updated 'entranceFee'
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'getEntranceFee',
    params: {},
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      async function updateUi() {
        const entranceFeeFromCall = (await getEntranceFee()).toString();
        setEntranceFee(entranceFeeFromCall); // storing it in raw form, will convert it now in the 'return()' function below.
      }
      updateUi();
    }
  }, [isWeb3Enabled]);
  return (
    <div>
      {/* Before we add the button to enter the lottery, we need to make sure that the contract address exists. Right now we're on 'localhost', so if we change to 'mainnet' our UI will crash, as we're calling a function non existing address. Because the 'chainId' for mainnet is not available in 'contractAddresses' in line 17, and it will return 'null' value to 'raffleAddress'.
      
      So when we call a function on a 'null' address, and try to convert the result to a string. 
      
      Unhandled Runtime Error
      TypeError: Cannot read properties of undefined (reading 'toString')

      So before we add a button to call the 'enterRaffle' function on the contract, we need to make sure that the contract exists. So we'll use a ternary operator, which will show the button and Entrance Fee only when there is a valid contract address and otehrwise show 'No Raffle address detected !'
      
      */}

      {raffleAddress ? (
        <div>
          <button
            onClick={async function () {
              await enterRaffle(); // calling the contract function
            }}
          >
            Enter Raffle
          </button>
          Entrance Fee: {ethers.utils.formatUnits(entranceFee, 'ether')} ETH
        </div>
      ) : (
        <div>No Raffle address detected !</div>
      )}
    </div>
  ); //adding the conversion from 'wei' to 'eth'
}

// In case the transactions are failing, make sure to reset the account in the Metamask.
