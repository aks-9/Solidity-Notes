// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract local
{
    uint public age = 10;

    //Pure is used when we're neither reading nor writing to state variable.
    function getter() public pure returns(uint)
    {
        uint roll = 1;
        return roll;
    }

    //In View, only read is allowed, but write is not allowed to state variable.
    function getAge() public view returns(uint)
    {
        return age;
    }

    //If we don't use either view or pure, then we will only get a warning in case of a getter function. In case of the setter funtion, we don't need to mention view/pure, we only need to mention visibility.
}


