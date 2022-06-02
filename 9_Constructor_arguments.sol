// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract Local
{
    //Passing an argument to constructor. We have to specify the argument at the time of deployment.

    uint public count;

    constructor(uint new_count) 
    {
        count = new_count;
    }    
}
