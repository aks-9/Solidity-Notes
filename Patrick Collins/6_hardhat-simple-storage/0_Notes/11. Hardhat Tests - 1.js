//* Hardhat Tests - 1

// This is a way to test our smart contract to ensure that our code does what it was written to do. Hardhat testing works with 'Mocha' framework, which is based on JavaScript.

//* This is './test/test-deploy.js' file.

// You can delete the 'artifacts' and 'cache' folder by running:
// yarn hardhat clean

//* Imports
const { ethers } = require('hardhat'); //importing ethers as we've to deploy our contract.
const { assert, expect } = require('chai'); // for making comparisions.

//* Describe block
// It takes two parameters, first is a  string for name, second is a function.

// describe('SimpleStorage', () => {}); // with an anonymous arrow function.

// with a normal function
describe('SimpleStorage', function () {
    let simpleStorageFactory;
    let simpleStorage; // declaring them here with 'let', instead of inside the 'beforeEach' block as a 'const'. This allows them be accessed by 'it' blocks.

    // This runs before each of our 'it' blocks, and takes an async function as a parameter.
    beforeEach(async function () {
        /* const */ simpleStorageFactory = await ethers.getContractFactory(
            'SimpleStorage'
        ); // getting the contract to deploy.
        /* const */ simpleStorage = await simpleStorageFactory.deploy(); // deploying
    });

    // This is where we write our tests. It takes two parameters, the first is a string to describe the test's functionality, and the second parameter is an async function. Inside the async function we'll write the actual test.
    it('Should start with the favorite number equal to 0', async function () {
        const currentValue = await simpleStorage.retrieve(); // fetching the value from the contract. This will be a Big Number value, so we have to convert it to string for comparision.
        const expectedValue = '0'; // this needs to be a string

        // 'assert' and 'expect' keywords are used to make comparisions. They come from a package called 'chai'. Here we'll use 'assert', it has many methods built into it.

        assert.equal(currentValue.toString(), expectedValue); // converting the 'currentValue' to string for comparision.
        // expect(currentValue.toString()).to.equal(expectedValue); // This is exactly same this as 'assert'. Only difference is syntax.
    });
});

/*
To run a test:

yarn hardhat test

OUTPUT:
yarn run v1.22.19
$ "D:\Work\Solidity Basics\Patrick Collins\6\node_modules\.bin\hardhat" test


  SimpleStorage
    ✔ Should start with the favorite number equal to 0 (67ms)


  1 passing (4s)

Done in 9.09s.


--------------------------------------------------------------

If we change the 'expectedValue' to '1', then the test will fail:

OUTPUT:

SimpleStorage
    1) Should start with the favorite number equal to 0


  0 passing (2s)
  1 failing

  1) SimpleStorage
       Should start with the favorite number equal to 0:

      AssertionError: expected '0' to equal '1'
      + expected - actual

      -0
      +1

      at Context.<anonymous> (test\test-deploy.js:39:16)



error Command failed with exit code 1.

*/
