// * 26. useState hook -1

// This is 'LotteyEntrance.js' file.

// * We want to show 'entranceFee' on the frontend page as well.

import { useWeb3Contract } from 'react-moralis';
import { contractAddresses, abi } from '../constants';
import { useMoralis } from 'react-moralis';
import { useEffect } from 'react';

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  // console.log(chainId);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  let entranceFee; //adding

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
        const entranceFee = (await getEntranceFee()).toString(); // converting to string.
        console.log(entranceFee);
      }
      updateUi();
    }
  }, [isWeb3Enabled]);
  return <div>Hi from Lottery Entrance {entranceFee}</div>; // adding to the page, but this will not show up.

  // But 'entranceFee' will show up in the console: 10000000000000000

  // This is because, when we get 'entranceFee', our browser doens't re-render, because 'entranceFee' is just a normal variable right now. Although, 'entranceFee' is updated but it is not triggering the re-render. So instead of 'entranceFee' being a normal varible, we'll use a 'useState' hook.
}
