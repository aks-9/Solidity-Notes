//* Manual Header -2

// This is 'ManualHeader.js' file.

import { useMoralis } from 'react-moralis';

export default function ManualHeader() {
  const { enableWeb3 } = useMoralis();

  //wrapping the contents of return with () and adding a button. The {} are used to write JavaScript in between HTML/ JSX. When we click this button, it will trigger an async anonymous arrow function, which will call 'enableWeb3()' function from 'useMoralis' hook.
  return (
    <div>
      <button
        onClick={async () => {
          await enableWeb3();
        }}
      >
        Connect
      </button>
    </div>
  );
}
// Now goto http://localhost:3000/ and disconnect all your accounts from Metamask , if they are already connected. Then click 'connect' button in our webpage, and Metamask should pop up to ask for connection.
