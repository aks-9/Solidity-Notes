//* Web3UiKit-2

// This is 'pages/index.js' file

import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
// import ManualHeader from '../components/ManualHeader';
import Header from '../components/Header'; // Using new Header.

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Our Smart Contract Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <ManualHeader /> */}
      <Header /> {/* Using the header from web3UiKit made component */}
      HELLO WORLD
    </div>
  );
}

// restart the server
// yarn run dev

// A new and better 'connect' button will be now on the webpage.
