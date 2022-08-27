//* IsWeb3Loading

// This is 'ManualHeader.js' file.

/*
We will disable the 'connect' button while the Metamask has popped up.
*/

import { useEffect } from 'react';
import { useMoralis } from 'react-moralis';

export default function ManualHeader() {
    const {
        enableWeb3,
        account,
        isWeb3Enabled,
        Moralis,
        deactivateWeb3,
        isWeb3EnableLoading, // checks to see if Metamask has popped up
    } = useMoralis();

    useEffect(() => {
        if (isWeb3Enabled) return;
        if (typeof window !== 'undefined') {
            if (window.localStorage.getItem('connected')) {
                enableWeb3();
            }
        }
    }, [isWeb3Enabled]);

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to: ${account}`);

            if (account == null) {
                window.localStorage.removeItem('connected');
                deactivateWeb3();
                console.log('Null account found');
            }
        });
    }, []);

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...
                    {account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3();

                        if (typeof window !== 'undefined') {
                            window.localStorage.setItem(
                                'connected',
                                'injected'
                            );
                        }
                    }}
                    disabled={isWeb3EnableLoading} // disabling the connect button once we click it and Metamask is loading
                >
                    Connect
                </button>
            )}
        </div>
    );
}

/*
Now when we click the 'connect' button, Metamask will pop up and the 'connect' button will become disabled.
*/
