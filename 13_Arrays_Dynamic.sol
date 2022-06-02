// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract Array
{
    /*We don't need to define the size of the array at the time of declaring the array in dynamic type array, nor do we need to define the elements of the array.
    */

    uint[] public arr;
    /* In dynamic type arrays, we have many different methods to push, pop elements in the array. */

    function pushElement(uint element)public
    {
        arr.push(element);//A new element will be added to the array at the end.

    }

    function popElement()public
    {
        arr.pop(); // We don't need to specify the element, as it will remove the last element in the array only.

    }

    function len() public view returns(uint)
    {
        return arr.length;
    }
}
