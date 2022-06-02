// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract Array
{
    uint[3] public arr;
    uint public count;

    //All loops need to be defined under a function//

    // function WhileLoop() public
    // {
    //     while( count < arr.length)
    // {
    //     arr[count]= count;
    //     count++;
    // }

    // }

    // function ForLoop() public
    // {
    //     for( uint i= count; i<=arr.length; i++)
    //     {
    //         arr[count]= count;
    //         count++;
    //     }

    // }

    function DoWhileLoop() public
    {
        do
        {
        arr[count]= count;
        count++;
        }
        while( count < arr.length); //Notice ; at the end of while loop.

    }
}
