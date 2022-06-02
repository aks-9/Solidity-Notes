// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract Array
{
    function check(int a) public pure returns(string memory)
    {
        string memory value;

        if (a>0)
        {
            value = 'Greater than zero';
        }
        else if (a==0)
        {
            value= 'Equal to zero';
        }
        else//No condition needed, this is the default condition that runs if no other condition is matched.
        {
            value= 'Less than zero';
        }
        return value;

    }
}
