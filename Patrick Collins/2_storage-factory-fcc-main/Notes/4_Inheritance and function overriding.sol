// SPDX-License-Identifier

pragma solidity ^0.8.8;

//* creating a new contract inherit from SampleContract  and write a function to perform overriding of function.

import "./0_SampleContract.sol";

contract NewContract is SampleContract {

    function write(uint _newVarible) public override{

        variable = _newVarible;

    }


}
