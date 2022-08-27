// * 27. useState hook -2

// This is 'LotteyEntrance.js' file.

// * We want to show 'entranceFee' on the frontend page as well.

import { useWeb3Contract } from 'react-moralis';
import { contractAddresses, abi } from '../constants';
import { useMoralis } from 'react-moralis';
import { useEffect, useState } from 'react'; // importing 'useState' hook
import { ethers } from 'ethers'; // for converting 'wei' into 'ether'

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [entranceFee, setEntranceFee] = useState('0'); // using the 'useState' hook
  // 'entranceFee' is going to be the VARIABLE we're going to call to get the entrance fee.
  // 'setEntranceFee' is going to be the FUNCTION to update or set that entrance fee. And whenever we set the entrace fee, it will re-render the frontend. In the 'useState' we are passing '0', which will act as the starting value of 'entranceFee'

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'enterRaffle',
    params: {},
    msgValue: '',
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
        const entranceFeeFromCall = (await getEntranceFee()).toString(); //renaming
        setEntranceFee(ethers.utils.formatUnits(entranceFeeFromCall, 'ether')); // calling the useState function. THis will trigger the re-render
        // console.log(entranceFee); This will still print '0' as 'setEntranceFee' function hasn't finished.
        // using 'ethers.utils.formatUnits()' to convert from 'wei' to 'ether'
      }
      updateUi();
    }
  }, [isWeb3Enabled]);
  return <div> Entrance Fee: {entranceFee} ETH</div>; // Now this will be visible.
}
