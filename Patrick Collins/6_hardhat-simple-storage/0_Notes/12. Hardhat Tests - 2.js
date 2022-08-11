//* Hardhat Tests - 2

//* This is './test/test-deploy.js' file.

const { ethers } = require('hardhat');
const { assert, expect } = require('chai');

//* Describe block
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

    it('Should store the favorite number equal to 7', async function () {
        const txResponse = await simpleStorage.store('7'); //calling the 'store' function of contract and changing the value of the favorite number equal to 7.
        await txResponse.wait(1); // waiting for block confirmation.

        const expectedValue = '7';
        const currentValue = await simpleStorage.retrieve(); // fetching the updated value.
        assert.equal(currentValue.toString(), currentValue);
    });
});

/*
To run a test:

yarn hardhat test

OUTPUT:

SimpleStorage
    ✔ Should start with the favorite number equal to 0 (46ms)
    ✔ Should store the favorite number equal to 7 (83ms)


  2 passing (3s)

Done in 4.79s.
*/
