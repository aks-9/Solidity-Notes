//* useNotification- 2

// This is 'LotteyEntrance.js' file.

//* Using a 'useNotification' hook in a component.

import { useWeb3Contract, useMoralis } from 'react-moralis';
import { contractAddresses, abi } from '../constants';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useNotification } from 'web3uikit'; // importing a hook for notification

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const dispatch = useNotification(); // getting 'dispatch' returned from 'useNotification'. This will give a little popup.

  const [entranceFee, setEntranceFee] = useState('0');

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'enterRaffle',
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'getEntranceFee',
    params: {},
  });

  // This will be triggered when our 'enterRaffle' function is successful after we click the 'Enter Raffle' button.
  const handleSuccess = async function (tx) {
    await tx.wait(1); // This is checking if transaction has a block confirmation.
    handleNewNotification(tx); // calling another function.
  };

  const handleNewNotification = function () {
    // calling 'dispatch', it will take some parameters.
    dispatch({
      type: 'info',
      message: 'Transaction Complete',
      title: 'Tx Notification',
      position: 'topR',
      icon: 'bell',
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      async function updateUi() {
        const entranceFeeFromCall = (await getEntranceFee()).toString();
        setEntranceFee(entranceFeeFromCall);
      }
      updateUi();
    }
  }, [isWeb3Enabled]);

  // Adding 'onSuccess' to our 'enterRaffle' runContract function. These function comes with 'onSuccess', 'onError', 'OnComplete' etc.
  return (
    <div>
      {raffleAddress ? (
        <div>
          <button
            onClick={async function () {
              await enterRaffle({
                // OnComplete:
                onSuccess: handleSuccess, // 'onSuccess' only checks if 'enterRaffle' function call is successfully SENT to metamask, and if it is , then it will trigger 'handleSuccess' function defined above. This isn't checking if transaction has a block confirmation.
                onError: (error) => console.log(error), // if our runContract function breaks this will let us know.
              });
            }}
          >
            Enter Raffle
          </button>
          Entrance Fee:
          {ethers.utils.formatUnits(entranceFee, 'ether')} ETH
        </div>
      ) : (
        <div>No Raffle address detected !</div>
      )}
    </div>
  );
}

/*
When we click our 'Enter Raffle' button, we're going to call 'enterRaffle' function, if it's successful, it will call 'handleSuccess' function. The 'handleSuccess' will wait for 'tx' to finish, then we'll call 'handleNewNotification', which will call 'dispatch' with some parameters.

* Enter Raffle button --> enterRaffle() --> onSuccess: --> handleSuccess() --> wait for 'tx' to finish --> handleNewNotification() --> dispatch()

*/
