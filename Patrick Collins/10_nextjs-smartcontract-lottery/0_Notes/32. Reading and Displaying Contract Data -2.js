//* 32. Reading and Displaying Contract Data -2

// This is 'LotteyEntrance.js' file.

// Number of players isn't re-rendering after a transaction is complete. So we will use 'handleSuccess'

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

  const [numberOfPlayers, setNumberOfPlayers] = useState('0');
  const [recentWinner, setRecentWinner] = useState('0');

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

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'getNumberOfPlayers',
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'getRecentWinner',
    params: {},
  });

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUi(); // adding this here will update the UI on every successful transaction.
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

  // Taking it out of our 'useEffect'
  async function updateUi() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();

    const numPlayersFromCall = (await getNumberOfPlayers()).toString();
    const recentWinnerFromCall = await getRecentWinner();

    setEntranceFee(entranceFeeFromCall);
    setNumberOfPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      // Took the async function out
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
          <div>The current number of players is: {numberOfPlayers}</div>
          <div>The most previous winner was: {recentWinner}</div>
        </div>
      ) : (
        <div>No Raffle address detected !</div>
      )}
    </div>
  );
}

// Now the number of players will auto update after a transaction is complete, without us having to refresh.
