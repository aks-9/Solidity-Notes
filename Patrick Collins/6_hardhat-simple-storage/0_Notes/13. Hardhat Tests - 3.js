//* Hardhat Tests - 3

// This is './test/test-deploy.js' file.

// Running a single test, out of multiple tests.

const { ethers } = require('hardhat');
const { assert, expect } = require('chai');

describe('SimpleStorage', function () {
    let simpleStorageFactory;
    let simpleStorage;

    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory('SimpleStorage');
        simpleStorage = await simpleStorageFactory.deploy();
    });

    it('Should start with the favorite number equal to 0', async function () {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = '0';

        assert.equal(currentValue.toString(), expectedValue);
    });

    // We can also add '.only' to the 'it' to just run that particular test.
    it.only('Should store the favorite number equal to 7', async function () {
        const txResponse = await simpleStorage.store('7');

        const expectedValue = '7';
        const currentValue = await simpleStorage.retrieve();

        assert.equal(currentValue.toString(), currentValue);
    });
});

/*
To run only the second test, we take a keyword from its description and use --grep flag:

yarn hardhat test --grep store

OUTPUT:


  SimpleStorage
    ✔ Should store the favorite number equal to 7 (71ms)


  1 passing (2s)

Done in 4.82s.


---------------------------------------------------------

yarn hardhat test

Output:

SimpleStorage
    ✔ Should store the favorite number equal to 7 (69ms)


  1 passing (2s)

Done in 4.97s.

==> Only the second test ran.



*/
