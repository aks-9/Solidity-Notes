//* Local Storage- 3

// This is 'ManualHeader.js' file.

/*
Now if we disconnect the accounts, and refresh the page, the Metamask auto pops up without even clicking on the 'click' button. We will fix that now, so that if we disconnect and refresh, it only asks for connection when we click the 'connect' button again.

To do this, we'll use another 'useEffect' to see if we've disconnected.
*/

import { useEffect } from 'react';
import { useMoralis } from 'react-moralis';

export default function ManualHeader() {
  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3 } =
    useMoralis(); //importing 'Moralis' and 'deactivateWeb3'

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== 'undefined') {
      if (window.localStorage.getItem('connected')) {
        enableWeb3(); // re-enable this
      }
    }
  }, [isWeb3Enabled]);

  // We've a blank 'dependancy' array, that means this 'useEffect' will run only once.
  // Here we want to say, whenever there is a re-render, we want to run if any account has changed. We can also see if this account is 'null' or disconnected.
  useEffect(() => {
    // 'onAccountChanged' takes a function as an input parameter.
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to: ${account}`);

      //if account is disconnected, we remove the key-value pair from local storage.
      if (account == null) {
        window.localStorage.removeItem('connected');
        deactivateWeb3(); // This will set 'isWeb3Enabled' to false
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

/*
Now if we are connected, and try to change the account, it will print in the console.

Account changed to: 0x6d28a1f460232d7bdd08fb2f2bc4abdf65923c82
Account changed to: 0xa30a6872cfb8ddb0ab4766a5d4a4a11ce49d5414


And, if we disconnect all accounts, it will remove the key-value pair from the local storage.

In the console it will show:
Account changed to: null
Null account found

And finally, now if we hit refresh, Metamask will not pop up unless we hit the 'connect' button.



*/
