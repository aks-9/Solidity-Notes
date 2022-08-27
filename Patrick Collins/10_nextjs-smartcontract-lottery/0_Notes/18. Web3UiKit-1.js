//* Web3UiKit-1

// In the 'components' folder create a new file 'Header.js'. We will install a library called 'Web3UiKit'. It has many buit-in components like 'Header', 'Connect' button components ready to be used.

//* This is 'components/Header.js' file

// yarn add web3uikit

import { ConnectButton } from 'web3uikit'; //importing

export default function Header() {
  return (
    <div>
      Decentralized Lottery
      <ConnectButton moralisAuth={false} />
      {/* Adding the connect button and specifying that we're not going to connect to a server. */}
    </div>
  );
}

// Now we can import it in our 'index.js' file instead of that ManualHeader.
