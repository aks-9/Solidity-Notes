// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract local
{
    bytes public b1 = 'abc'; //In dynamic bytes array, we don't have to define the size of the array.

    function pushElement() public
    {
        b1.push('d'); //adding new element to the b1 dynamic bytes array.
    }

    function getElement(uint index) public view returns(bytes1) {//Because we're accessing just one element of size 1 byte at a time, so the return type will be bytes1 even though this is a dynamic bytes array.
        return b1[index];
    }
}
