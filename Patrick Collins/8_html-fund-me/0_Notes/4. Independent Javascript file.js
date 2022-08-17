//* Independent Javascript file

// create a new file called 'index.js' in the root of the project.

// This is 'index.js' file

async function connect() {
  //Checking if we have Metamask installed or not.
  if (typeof window.ethereum !== undefined) {
    console.log('Metamask is installed');

    //connecting to Metamask
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    console.log('connected to Metamask');

    //updating the text in the connect button
    document.getElementById('connectButton').innerHTML = 'Connected!';
  } else {
    console.log('Metamask not installed...');
    document.getElementById('connectButton').innerHTML =
      'Please install Metamask!';
  }
}
