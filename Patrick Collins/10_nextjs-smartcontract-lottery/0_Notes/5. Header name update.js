//* Header name update

// This is 'pages/index.js' file

import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import ManualHeader from '../components/ManualHeader'; //updated

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Our Smart Contract Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ManualHeader /> {/* updated the name to ManualHeader' */}
      HELLO WORLD
    </div>
  );
}
