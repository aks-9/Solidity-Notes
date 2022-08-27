// * Automatic Constant Value UI Frontend Updater -4

// This is 'LotteyEntrance.js' file.

import { useWeb3Contract } from 'react-moralis';
import { contractAddresses, abi } from '../constants'; // specifying a folder instead of each individual files, because this folder has an 'index.js' file that represents this whole folder.

export default function LotteryEntrance() {
  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddresses, //! specify the network id
    functionName: 'enterRaffle',
    params: {},
    msgValue: '', //! need this
  });

  return <div>Hi from Lottery Entrance</div>;
}
