// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;


contract SendETH{

    //Transecting Ether to a dynamically defined address.
   

    receive() external payable{
    
    }

    function checkBal() public view returns(uint){
        return address(this).balance;
    }

    
    function send(address payable getter) public{ //Passing a dynamically defined address defined by user.
        bool sent = getter.send(1000000000000000000);
        require(sent,"Tx has failed");
    }

    
    
    function transfer(address payable getter) public { //Passing a dynamically defined address defined by user.
        getter.transfer(1000000000000000000);
    }

    
    function call(address payable getter) public {//Passing a dynamically defined address defined by user.
        (bool sent,) = getter.call{value:1000000000000000000}("");
        require(sent,"Tx has failed");
    }

    //https://www.youtube.com/watch?v=0U0g_CUqlho&list=WL&index=17






}
