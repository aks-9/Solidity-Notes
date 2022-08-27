//* useEffect Hook -1

// This is 'ManualHeader.js' file.

/*
Right now if we refresh our page, we have to manually click the 'connect' button again even though our Metamask is already connected. When we hit refresh, our website doesn't know that we've hit 'enableWeb3' already.

So we'll add a functionality, such that the moment we re-render, it automatically checks if we're already connected, and if we are, then show the 'account' info instead of a 'connect' button.

To do this we will use another hook called 'useEffect'.

So we have this function called 'useEffect'. It has two parameters, first is an arrow function, and second is called a 'depedancy array'. The second parameter is optional.

*SYNTAX: useEffect(() => {}, []);

This 'useEffect' will keep checking the values in this 'dependancy array', and if anything changes in the 'dependancy array', it is going to call the 'arrow function' in the first parameter, and then re-render the frontend.

*/

import { useEffect } from 'react'; // importing
import { useMoralis } from 'react-moralis';

export default function ManualHeader() {
  const { enableWeb3, account, isWeb3Enabled } = useMoralis(); //importing 'isWeb3Enabled', it is a boolean value.

  //* USE EFFECT
  useEffect(() => {
    console.log('Hi');
    console.log(isWeb3Enabled);
  }, [isWeb3Enabled]);
  // This 'useEffect' will be constantly running, and it will be listening to see if 'isWeb3Enabled' changes. Any time we run 'enableWeb3', the value of 'isWeb3Enabled' becomes 'true'.This will give us the following output in the console:

  /*
    ! Before checking the output, go to 'next.config.js' file and turn the strict mode to 'false':

    const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
  };

  */

  /*


  * Case 1. Automatically runs on load of frontend for the first time.

     useEffect(() => {
    console.log('Hi');
    console.log(isWeb3Enabled);
  }, [isWeb3Enabled]);
  
    * OUTPUT:

    Hi
    false

    Right now it's giving us a 'false' value, but if we click on 'connect' then 'isWeb3Enabled' is changed to 'true' by 'enableWeb3', and when this change happens, it re-renders the frontend to reflect the changes. So now our output will be:

    * OUTPUT:
    Hi
    false
    Hi
    true


  * Case 2. If there is no dependancy array:    

    useEffect(() => {
        console.log('Hi');
        console.log(isWeb3Enabled);
    });

    * It will still run on load, and it will run anytime something re-renders.

    * OUTPUT:

    Hi
    false

    
    ! BE CAREFUL with this, as you could get circular renders.
    If you have some 'useEffect' that changes some value, and you have another 'useEffect' that re-renders when that value changes, they both are going to keep changing back and forth.


  * Case 3. If we give a blank dependancy array:

    useEffect(() => {
        console.log('Hi');
        console.log(isWeb3Enabled);
    }, []);
    
    * It will run only once on first time load and stop.

    * OUTPUT:

    Hi
    false

    Even if we click on 'connect' it will not run again.
    
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
