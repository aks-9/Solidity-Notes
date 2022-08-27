//* Editing Boilerplate

// This is 'pages/index.js' file
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Lottery</title> {/* Giving a title */}
        <meta name="description" content="Our Smart Contract Lottery" />
        {/* adding description */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      HELLO WORLD {/* Heading on the page */}
    </div>
  );
}
