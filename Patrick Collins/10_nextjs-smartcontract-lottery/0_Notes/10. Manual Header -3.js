//* Manual Header -3

// This is 'ManualHeader.js' file.

//* Make the 'Connect' button dynamic. So if we're connected, it will show 'Connected to Metamask!', if we're not connected, it will show the 'Connect' button to connect the account.

import { useMoralis } from 'react-moralis';

export default function ManualHeader() {
  const { enableWeb3, account } = useMoralis(); // importing 'account'

  // Using a ternary operator from JS. The syntax is: account ? () : ()
  // If there is an account connected, show 'Connected to Metamask!' and if there is no account connected, then show the 'Connect' button.
  return (
    <div>
      {account ? (
        <div>Connected to Metamask!</div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3();
          }}
        >
          Connect
        </button>
      )}
    </div>
  );
}
