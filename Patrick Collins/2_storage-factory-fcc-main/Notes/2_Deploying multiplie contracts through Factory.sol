// SPDX-License-Identifier: MIT

//* Deploying multiple contracts through a Factory contract.

pragma solidity ^0.8.0;

import "./0_SampleContract.sol"; // importing the contract we need to deploy, it needs to be in the same folder as this contract.

// Creating a Factory contract.
contract Factory {
    SampleContract[] public deployedContracts; //creating a dynamic array called 'deployedContracts', which will be of type 'Contract', the contract we need to deploy.

    // To deploy a new contract, creating a setter function
    function deployContract() public {
        SampleContract newContract = new SampleContract(); // creating a new variable 'newContract' of type 'Contract'. Then creating a new instance of that contract using the 'new' keyword and a special method with the name of the contract we need to deploy.

        deployedContracts.push(newContract); //adding the newly deployed contract's address to the 'deployedContracts' array using the 'push' method for array.
    }
}
