// SPDX-License-Identifier: MIT

//* Deploying a contract through another contract.

pragma solidity ^0.8.0;

import "./0_SampleContract.sol"; // importing the contract we need to deploy, it needs to be in the same folder as this contract.

// This contract that will deploy our imported contract will act like a Factory to deploy a new contract. So naming it as 'Factory' contract.
contract Factory {
    SampleContract public newContract = new SampleContract(); // creating a new variable 'newContract' of type 'SampleContract'. Then creating a new instance of that contract using the 'new' keyword and a special method with the name of the contract we need to deploy. It is a 'public' variable so that we can get a 'getter' function automatically created for it by our compiler.
}
