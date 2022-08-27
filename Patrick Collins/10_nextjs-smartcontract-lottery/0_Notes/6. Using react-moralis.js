//* Using react-moralis

// yarn add react react-dom moralis react-moralis

//* Update the name to 'ManualHeader.js'

// This is 'Header.js' file.

import { useMoralis } from 'react-moralis'; // importing

export default function ManualHeader() {
  const { enableWeb3 } = useMoralis(); // 'useMoralis' is a React Hook. It's a way to keep track of 'state' of our application.

  return <div>Hi from the Header!</div>; //returns HTML
}

// Now we can import it in our 'index.js' file.
