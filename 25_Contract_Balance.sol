// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract pay
{
    address payable user = payable(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2); //This address is used to which we make the transfer of ether.

    function payEther() public payable
    {

    }// Payable keyword is used when we have to transfer ether in our contract.


    function getBalance() public view returns(uint) { //To check the balance in the account of this contract.
        return address(this).balance; // 'this' keyword is used to fetch the balance from the current contract.
    }

    function sendEtherToAccount() public
    {
        user.transfer(1 ether);

    } //We'll transfer ether from this account to another. We don't need to make this payable as we only make that function/contract 'payable' in which we need to send the ether.

}
