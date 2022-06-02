// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract Demo_enum
{
    //When we assign a name to an integral value, it's called enum.
    //It enhances readability of the code.
    //Enum can be created inside or outside the contract.
    //Generally used in limited set of values.

    enum user{allowed, not_allowed, wait} //creating 'user' of type enum. We've assigned 0 to allowed, 1 to not_allowed, and 2 to wait.

    user public u1 = user.allowed; //creating a varible 'u1' of type user and assigning 'allowed' value to it.

    //Using an enum to withdraw lottery amount by an owner.
    uint public lottery = 1000;

    function owner() public
    {
        if(u1==user.allowed)
        {
            lottery=0;
        }
    }

    function changeOwner() public
    {
        u1=user.not_allowed;
    }



}
