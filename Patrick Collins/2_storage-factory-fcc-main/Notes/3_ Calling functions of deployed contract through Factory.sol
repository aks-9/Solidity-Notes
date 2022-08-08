//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./0_SampleContract.sol";

contract Factory {

    SampleContract[] public deployedContracts;

    function deployContract() public {
        SampleContract newContract = new SampleContract();
        deployedContracts.push(newContract);

    }

    function factoryWrite(uint _index, uint _newVariable) public {

        deployedContracts[_index].write(_newVariable);

    }

    function factoryRead(uint _index) public view returns (uint) {
        
        return deployedContracts[_index].read();

    }

}