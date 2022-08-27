// * Introduction to Calling Functions of NextJS

// Now our app needs to have a button to allow a user to enter the lottery. So create a new file 'LotteyEntrance.js' in the 'components' folder.

// This is 'LotteyEntrance.js' file.

//* We will create a function, to call the function in our contract to enter the lottery , using 'useWeb3Contract()' hook.

import { useWeb3Contract } from 'react-moralis'; // importing

export default function LotteryEntrance() {
  // Using 'runContractFunction' from 'useWeb3Contract' to call 'enterRaffle' function on our contract.
  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: '',
    contractAddress: '',
    functionName: '',
    params: {},
    messageValue: '',
  });

  return <div>Hi from Lottery Entrance</div>;
}
