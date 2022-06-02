// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract Array
{

    /* Fixed type array- We know the length of the array at compile time.
    Arrays are declared like this:

    datatype[array_length] visibility array_name = [array_values];
    */
    uint[4] public arr = [10,20,30,40];

    /* size of fixed type array is defined before compiling, so at the compile time, the size of the array is known to the compiler. */

    //If we give more values than the size of the array, it will give 'out of bound' error.

    //setting a new value at a particular index of an array.
    function setter(uint index, uint value) public
    {
        arr[index] = value;

    }

    function length() public view returns(uint)
    {
        return arr.length;
    }
}
