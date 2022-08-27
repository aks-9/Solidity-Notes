//* Manual Header -4

// This is 'ManualHeader.js' file.

//* Show account address. Truncate it.

import { useMoralis } from 'react-moralis';

export default function ManualHeader() {
  const { enableWeb3, account } = useMoralis();

  /*
    Showing account info by adding {account}. We can also use 'slice' method to first truncate the address to only 6 characters. Then after '...' use another 'slice' method but this time passing the length of the address and subtracting 4 from it. The result is: 

    Connected to 0xa30a...5414
    HELLO WORLD

    If we change the accounts from Metamask, the component will auto reload and show the new address of the account. So these hooks are very useful to re-render our frontend, whenever some value changes.
    */

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
          }}
        >
          Connect
        </button>
      )}
    </div>
  );
}
