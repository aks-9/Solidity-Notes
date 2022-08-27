//* Local Storage- 1

// This is 'ManualHeader.js' file.

//* So we're going to store a new key-value pair in our browser's local storage.

import { useEffect } from 'react';
import { useMoralis } from 'react-moralis';

export default function ManualHeader() {
  const { enableWeb3, account, isWeb3Enabled } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;
    // enableWeb3(); // so that it doesn't prompt us for connection every time we save.
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
              window.localStorage.setItem('connected', 'injected'); // We want our app to remember that somebody recently hit the 'connect' button, and they connected to our app. So when a user clicks 'connect' button,  we're going to use 'local storage' of our browser to store that a user connected recently.
              //Sometimes NextJs has a hard time with 'window' object, so we are going to wrap our line of code to be added in a if statement.
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

Go to browser frontend and press 'ctrl+shift+j' to open console. Then switch to the 'Application' tab in it. On the left side menu, under the 'Storage' section,  click on 'Local Storage', and then on 'http://localhost:3000/'. 

*/

// Now if we disconnect, and refresh, and then hit the 'connect' button. In our local storage, we'll see a key value pair, showing we're connected.
