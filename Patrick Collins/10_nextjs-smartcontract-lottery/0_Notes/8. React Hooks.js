//* React Hooks

// This is 'ManualHeader.js' file.

// Hooks allow function components to have access to the 'state' and other React feautures.

// We want our app to be different when we are connected to Metamask, as compared to when we're not connected to Metamask. If we use a simple variable to connect, and set it 'true' or 'false' based on we're connected or not, then if we change the variable from 'false' to 'true' it won't re-render our website.

// So to solve this, we use 'hooks' as a way to work with the 'state' and automatically re-render the website whenever something changes. And 'enableWeb3' is going to be a function we get from 'useMoralis' hook to do this.

import { useMoralis } from 'react-moralis';

export default function ManualHeader() {
  const { enableWeb3 } = useMoralis(); // importing 'enableWeb3' function

  return <div>Hi from the Header!</div>;
}
