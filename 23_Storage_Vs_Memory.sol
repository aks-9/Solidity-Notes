// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

/*

STORAGE
1. Stores state variables.
2. Persistent or permanent data.
3. Cost gas.

MEMORY
1. Stores local variables, if they're reference types.
2. Temporary data.
3. No gas.

*/

contract demo
{
    string[] public student = ['neo','sam','leo']; //Creating a dynamic array.

    function mem() public view
    {
        string[] memory s1 = student;//Copying the contents of 'student' stored in storage into 's1' stored in memory.
        s1[0]='ash';
    }

    function sto() public
    {
        string[] storage s1 = student;//Passing the address (reference) of 'student' stored in storage into 's1'. No copy is made in memory. 's1' is now pointing to 'student'.
        s1[0]='ash';

        //Any change made to 's1' here will reflect in the original array it is pointing.
    }


}
