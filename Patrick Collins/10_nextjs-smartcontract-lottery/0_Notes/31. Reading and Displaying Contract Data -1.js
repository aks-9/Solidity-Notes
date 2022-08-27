//* 31. Reading and Displaying Contract Data -1

// This is 'LotteyEntrance.js' file.

import { useWeb3Contract, useMoralis } from 'react-moralis';
import { contractAddresses, abi } from '../constants';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useNotification } from 'web3uikit';

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const dispatch = useNotification();
  const [entranceFee, setEntranceFee] = useState('0');

  const [numberOfPlayers, setNumberOfPlayers] = useState('0'); // for number of players
  const [recentWinner, setRecentWinner] = useState('0'); // for recent winner

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

  // To display the number of players
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'getNumberOfPlayers',
    params: {},
  });

  // To display the recent winner
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'getRecentWinner',
    params: {},
  });

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
  };

  const handleNewNotification = function () {
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

        const numPlayersFromCall = (await getNumberOfPlayers()).toString(); // adding
        const recentWinnerFromCall = await getRecentWinner(); // adding

        setEntranceFee(entranceFeeFromCall);
        setNumberOfPlayers(numPlayersFromCall); // adding
        setRecentWinner(recentWinnerFromCall); // adding
      }
      updateUi();
    }
  }, [isWeb3Enabled]);

  return (
    <div>
      {raffleAddress ? (
        <div>
          <button
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
          >
            Enter Raffle
          </button>
          <div>
            Entrance Fee:
            {ethers.utils.formatUnits(entranceFee, 'ether')} ETH
          </div>
          <div>
            The current number of players is: {numberOfPlayers} {/* Adding */}
          </div>
          <div>The most previous winner was: {recentWinner}</div> {/* Adding */}
        </div>
      ) : (
        <div>No Raffle address detected !</div>
      )}
    </div>
  );
}
