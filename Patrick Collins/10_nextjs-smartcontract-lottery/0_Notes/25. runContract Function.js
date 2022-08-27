// * 25. runContract Function

// This is 'LotteyEntrance.js' file.

import { useWeb3Contract } from 'react-moralis';
import { contractAddresses, abi } from '../constants';
import { useMoralis } from 'react-moralis'; //importing
import { useEffect } from 'react'; //importing

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis(); // Mosralis knows about the 'chainId' because in our "Header" section, the 'Header' passes up all the information  about Metamask to the 'Moralis Provider'. And then the "Moralis Provider" passes it down to all the components inside the <MoralisProvider> tag.
  // The 'chainId' actually gives us the hex version of the 'chainId', so we rename the 'chainId' to 'chainIdHex'.

  const chainId = parseInt(chainIdHex); //converting the Hex value to integer value.

  console.log(chainId); // converting to integer value. This will now print '31337' in the console. Earlier it was giving us '0x7a69' which is the 'hex' version on hardhat localhost chain.

  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null; // if 'chainId' exists in contractAddresses, then take the first element of the array, otherwise 'null'.

  // 'runContractFunction' can both send a transaction and read state
  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // adding
    functionName: 'enterRaffle',
    params: {},
    msgValue: '', // All we need now is this 'msg.valu'e, that is actually 'entranceFee' to enter the lottery.
  });

  //* Right when our 'enterRaffle' function loads, we're going to run another function to read that entrance fee value, i.e. 'msg.value'. We'll use a 'useEffect' hook for this.

  // we need to call 'getEntranceFee' function on our contract to get 'entranceFee'
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // adding
    functionName: 'getEntranceFee',
    params: {},
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      // try to read the raffle entrance fee only if 'isWeb3Enabled' is 'true'
      async function updateUi() {
        const entranceFeeFromContract = await getEntranceFee(); // this is an 'async' function, so we have to use 'await'. But we can't use 'await' in a 'useEffect' hook. So we create a new 'async' function called 'updateUi', call 'getEntranceFee' using 'await', and then call 'updateUi' from the 'useEffect' hook.
        console.log(entranceFeeFromContract);
      }
      updateUi(); // calling the async function, that calls 'getEntranceFee'
    }
  }, [isWeb3Enabled]); // 'isWeb3Enabled' starts off as 'false' when we refresh, but then browser checks the local storage, and triggers 'enableWeb3', that turns 'isWeb3Enabled' to 'true', and then 'useEffect' is triggered as 'isWeb3Enabled' is in its dependancy array.
  return <div>Hi from Lottery Entrance</div>;
}
