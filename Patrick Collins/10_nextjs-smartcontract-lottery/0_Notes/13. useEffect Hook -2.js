//* useEffect Hook -2

// This is 'ManualHeader.js' file.

import { useEffect } from 'react';
import { useMoralis } from 'react-moralis';

export default function ManualHeader() {
  const { enableWeb3, account, isWeb3Enabled } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return; // This means we're already connected to 'enableWeb3'
    enableWeb3(); // if we're not connected to 'enableWeb3', we'll call it to connect.
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
          }}
        >
          Connect
        </button>
      )}
    </div>
  );
}

// Now if we're connected to Metamask, it will not show us a 'connect' button. Instead, it will show us the connected account's address, even if we refresh the page.

// But now if we disconnect, and refresh the page, it will automatically pop up the Metamask, without us having to even click on 'Connect' button, which could be annoying.
