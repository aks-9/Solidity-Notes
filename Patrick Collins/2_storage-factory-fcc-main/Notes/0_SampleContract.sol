// SPDX-License-Identifier

pragma solidity ^0.8.8;

//creating a new empty contract.

contract SampleContract {

    uint variable;

    function write(uint _newVarible) public{

        variable = _newVarible;

    }

    function read() public view returns (uint){
        return variable;
    }


}
