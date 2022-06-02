// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract state
{
    uint public age; // default value is the least value of the datatype. State variables are stored in contract storage, i.e. blockchain.
    /* 
    1. When we use 'public' keyword before any variable, a get function is automatically created for it. By default visibility of all variables is set to 'private'. We have to explicitly make it public by using the 'public' keyword.

    2. State variables can't be initialized after declaration. 'age = 15;' will give error. They either must be initialized while declaration, like 'unit public age = 15;' or they must be initialized using a constructor.
    constructor() public
    {
        age= 15;
    }

    3. Third way to initialize a state variable is to create a setter function.
    function setAge() public
    {
        age = 15;
    }        

4. All state varibles must be complied and deployed again, if new state varibles are added or changes are made.
    */

    

}
