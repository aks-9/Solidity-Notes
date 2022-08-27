//* 37. Tailwind and Styling- 4-adding button spinner

// This is 'LotteyEntrance.js' file.

//* Add 'Tailwind CSS IntelliSense' from the extensions.

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

    // importing 'isLoading', 'isFetching' from 'useWeb3Contract'
    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
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
        updateUi();
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
            updateUi();
        }
    }, [isWeb3Enabled]);

    return (
        <div className="p-5">
            {' '}
            {/* Adding the padding*/}
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto" /* Adding the button color and font*/
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            });
                        }}
                        disabled={
                            isLoading || isFetching
                        } /* Disabling the button when it is loading or fetching data*/
                    >
                        {/* Adding a spinner using a ternary operator. */}
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div> // Spinner
                        ) : (
                            'Enter Raffle' //Button text
                        )}
                    </button>
                    <div>
                        Entrance Fee:
                        {ethers.utils.formatUnits(entranceFee, 'ether')} ETH
                    </div>
                    <div>
                        The current number of players is: {numberOfPlayers}
                    </div>
                    <div>The most previous winner was: {recentWinner}</div>
                </div>
            ) : (
                <div>No Raffle address detected !</div>
            )}
        </div>
    );
}
