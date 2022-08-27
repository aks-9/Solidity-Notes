//* Local Storage- 2

// This is 'ManualHeader.js' file.

/*
Now whenever we refresh the page we want it to remember that we recently connected instead of having to click on 'connect' button again, we will check if we have that key-value pair in our local storage or not. If it is there, that means we had connected recently, and don't need to prompt for connection.
*/

import { useEffect } from 'react';
import { useMoralis } from 'react-moralis';

export default function ManualHeader() {
  const { enableWeb3, account, isWeb3Enabled } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== 'undefined') {
      if (window.localStorage.getItem('connected')) {
        // checking if we have the key-value pair in local storage. If it exists, only then we will call 'enableWeb3'. Notice 'getItem' is used, not 'setItem'.
        enableWeb3(); //calling if there is a key-value pair
      }
    }
    // enableWeb3();
  }, [isWeb3Enabled]);

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
              window.localStorage.setItem('connected', 'injected');
            }
          }}
        >
          Connect
        </button>
      )}
    </div>
  );
}
