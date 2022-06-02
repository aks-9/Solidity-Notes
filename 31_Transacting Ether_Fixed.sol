// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;


contract SendETH{

    //Transecting Ether to a pre defined address.
    address payable public getter = payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db);

    receive() external payable{
    
    }

    function checkBal() public view returns(uint){
        return address(this).balance;
    }

    //Will return a bool value.
    //Tx limit is predefied.Tx will fail if gas is more than 2300 Gwei.
    //WIll not revert gas amount.    
    //Will not revert state variables even if Tx fails.
    //That's why we must use require(); to check if transaction has passed or failed and revert the state variables and return the gas back.
    function send() public{ 
        bool sent = getter.send(1000000000000000000);
        require(sent,"Tx has failed");
    }

    
    //Tx gas limit is predefied. It will fail if gas is more than 2300 Gwei.
    //No need of require();
    //It reverts changes and gas automatically if Tx fails.
    function transfer() public {
        getter.transfer(1000000000000000000);
    }

    //Will return a bool value and bytes data.
    //Tx limit can be set manually.
    //WIll not revert gas amount.    
    //Will not revert state variables even if Tx fails.
    //That's why we must use require(); to check if transaction has passed or failed and revert the state variables and return the gas back.
    function call() public {
        (bool sent,) = getter.call{value:1000000000000000000}("");
        require(sent,"Tx has failed");
    }

    //https://www.youtube.com/watch?v=0U0g_CUqlho&list=WL&index=17






}
