// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract array
{ 
    bool public value=true; //bool datatype holds boolean values.Default value is false.
    function check(uint a) public returns(bool) { //Because we're returning a bool datatype from this funtion.
        if(a>100)
        { 
            value= true;
            return value;
        }
        else
        { 
            value= false;
            return value;
        }
    }
}