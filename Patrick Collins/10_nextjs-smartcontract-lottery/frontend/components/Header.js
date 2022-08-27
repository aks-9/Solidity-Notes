//* 36. Tailwind and Styling- 3

// This is 'Header.js' file

//* Using Tailwind 'className' in the <div> tags of our components.

// Let's say we want to add a border to our Header. Use the search feature to search what you need to add. For example: 'border'

// border-b-2	border-bottom-width: 2px;

import { ConnectButton } from 'web3uikit';

export default function Header() {
    return (
        <div className="p-5 border-b-2 flex flex-row">
            {/* Adding the border*/}
            <h1 className="py-4 px-4 font-bold text-3xl">
                {' '}
                Decentralized Lottery
            </h1>
            {/* Adding the font*/}
            <div className="ml-auto py-2 px-4">
                {/* Adding the padding*/}
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    );
}

// Press 'ctrl+ c' to stop the already running server in the terminal. Restart the frontend server to reflect changes by running : yarn run dev
