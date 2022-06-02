// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

//Global Variables:
//Built in variables in solidity to perform specific tasks.
//List of all global varibles available on documentation of solidity.

contract G_Var
{
    function glob() public view returns(uint block_no, uint timestamp, address msgSender)
    {
        return(block.number,block.timestamp,msg.sender);
    }
    //msg.sender tells us who deployed the contract.


}



