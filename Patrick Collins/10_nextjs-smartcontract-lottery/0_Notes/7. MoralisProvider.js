//* MoralisProvider

// Now in order to be able to use Moralis, our entire application needs to be wrapped around what's called a 'Moralis Provider', which is going to be a context provider for us. So what we need to do, is to add this 'Moralis Provider' to our '_app.js'

// This is '_app.js' file.

import '../styles/globals.css';
import { MoralisProvider } from 'react-moralis'; //adding

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      {/* This 'initializeOnMount' is an option to hook into a server to add some more features to a website*/}
      <Component {...pageProps} />
    </MoralisProvider> // wrapping our app with MoralisProvider
  );
}

export default MyApp;

// Now we can start using Hooks.
