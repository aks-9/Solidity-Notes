// SPDX-License-Identifier: GPL-3.0

pragma solidity >= 0.5.0 < 0.9.0;

contract Identity
{
    //STATE VARIABLES DECLARATION- Stores on blockchain
    string name;
    uint age; //default value is 0 for uint.

    //CREATING A CONSTRUCTOR
    constructor() public
    {
        name = "Ashish";
        age = 20;
    }

    //Need to create 2 functions to read name and age.

    function getName() view public returns(string memory)
    {
        return name;
    }

    function getAge() view public returns( uint)
    {
    return age;
    }


    //WRITING TO AGE
    function setAge() public
    {
        age = age + 1;
    }

}
