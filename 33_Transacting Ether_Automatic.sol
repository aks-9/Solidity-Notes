// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;


contract SendETH{

    //Transecting Ether automatically to a dynamically defined address. We won't have to first transfer to this contract and then transfer to a address. ETH will come and go to that address in a single transaction.


    receive() external payable{

    }

    function checkBal() public view returns(uint){
        return address(this).balance;
    }

    event log(uint value);


    function send(address payable getter) public payable{ //Must make the function payable to use msg.value global variable, because it will receive ETH as well instead of receive function.
        bool sent = getter.send(msg.value);
        require(sent,"Tx has failed");

        emit log(msg.value);
    }



    function transfer(address payable getter) public payable {
        getter.transfer(msg.value);
    }


    function call(address payable getter) public payable {
        (bool sent,) = getter.call{value:msg.value}("");
        require(sent,"Tx has failed");
    }

    //https://www.youtube.com/watch?v=0U0g_CUqlho&list=WL&index=17






}

