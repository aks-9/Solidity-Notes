// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract Local
{
    //constructor is only executed once, at the time of executing the contract. You can make only one constructor.
    //Used to initialize a state variable.
    // Once the value is initialized, we can't change it without making a setter function.
    // Also used to declare the owner of the contract.
    //It is optional to create, not compulsary.
    //If you don't create a constructor, then a default constructor  is automatically created in the background by the compiler.

    uint public count;

    constructor()
    {
        count = 0;
    }



}
