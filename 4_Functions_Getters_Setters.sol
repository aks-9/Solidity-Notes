// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract local
{
    uint age = 10;

    //GETTER FUNCTION SYNTAX
    //function function_name() visibility pure/view returns(datatype)
    function getter() public view returns(uint)
    {
        return age;
    }
    //'public' keyword signifies that this function can be accessed internally or externally by all.
    // 'view' keyword signifies that we're only reading the state variable and not making any changes to it.
    //The datatype inside the 'returns' keyword tells us what kind of value does this function is going to return.
    //Getter function doesn't cost any gas.
    //If we make out state variable 'public', then there is no need to make a getter function separately, a default getter function is created for it automatically in solidity.

    //SETTER FUNCTION SYNTAX
    //function function_name() visibility
    function setter() public
    {
        age = age + 1;
    }
    //setter function doesn't return any datatype.
    // No need to mention pure/view as we're going to change the value of the state variable.
    //Setter function costs gas.
}
