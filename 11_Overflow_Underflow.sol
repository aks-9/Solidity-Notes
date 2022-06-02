// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0; //TO BE NOTED

contract local 
{
    uint8 public money = 255;

    function setter() public 
    {
        money = money + 1;
    }
    // money will become 0 once setter() is called as int8 will be overflowed.
}
