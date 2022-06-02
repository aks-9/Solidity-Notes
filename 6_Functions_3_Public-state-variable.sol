// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract local
{
    uint public age = 100;

    //If we create a public state variable, then we don't need to create a seperate getter function. It is automatically created.

    function setter(uint newage) public
    {
        age = newage;
    }
    
}