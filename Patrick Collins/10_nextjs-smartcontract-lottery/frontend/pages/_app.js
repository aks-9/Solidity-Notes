//* useNotification- 1

// This is 'pages/_app.js' file.

// * Creating notifications for the user using 'useNotification' from 'web3uikit'.

import '../styles/globals.css';
import { MoralisProvider } from 'react-moralis';
import { NotificationProvider } from 'web3uikit'; // importing

function MyApp({ Component, pageProps }) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                {' '}
                {/** wrapping our components in notification */}
                <Component {...pageProps} />
            </NotificationProvider>
            {/** wrapping our components in notification */}
        </MoralisProvider> // wrapping our app with MoralisProvider
    );
}

export default MyApp;
