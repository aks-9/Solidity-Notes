// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"; //data feed contract
import "./PriceConverter.sol"; //importing our library.

//* Interfaces.
// Instead of importing the whole contract to get the ABI, we can simply use an interface. An interface just tells our contract what functions we can call on the the given contract. It doesn't import any logic, so it doesn't make our contract code heavy. When compiles, interfaces give us the ABI.

error NotOwner(); // defining custom a error.

contract FundMe {
    using PriceConverter for uint256; //using the library we imported.

    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders;

    address public i_owner; // 'immutable' variables can't be changed like a constant, but they are first declared, and then later on set in a constructor. They are also saved in 'bytecode'. Naming convention is to prefix them with 'i_'. eg. i_varibaleName


    uint256 public constant MINIMUM_USD = 50 * 10 ** 18; // 1 ETH can be written as 1e18. or 1 * 10 ** 18. This means one into 10 raise to the power 18. 
    // Making 'MINIMUM_USD' a 'constant' will save it in 'bytecode' directly instead of 'storage', which will be cheaper and gas efficient. Assigned at compile time. They are usually named in capital letters.
    
    constructor() {
        i_owner = msg.sender; //setting an immutable varible in construcotor.
    }

    function fund() public payable {
        require(msg.value.getConversionRate() >= MINIMUM_USD, "You need to spend more ETH!"); // using 'uint256' as an object to call a function 'getConversionRate' in 'PriceConverter' library. 'msg.value' will be passed as the first argument to 'getConversionRate'

        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");

        addressToAmountFunded[msg.sender] += msg.value;
        funders.push(msg.sender);
    }
    
    function getVersion() public view returns (uint256){
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e); //specifying the contract address for data feed.
        return priceFeed.version(); //calling function 'version' on ' contract.
    }
    
    modifier onlyOwner {
        // require(msg.sender == owner); // Not using require, instead using custom error.
        // custom errors are gas efficient, as they don't have to store the error message string. We directly call the code instead of string, that saves gas.
        if (msg.sender != i_owner) revert NotOwner(); // Combing an 'if' statement, with a condition, and calling our custom error 'NotOwner' with 'revert' keyword.
        _;
    }
    
    function withdraw() payable onlyOwner public {
        for (uint256 funderIndex=0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0); // using 'new' keyword and resetting the 'funders' array. It will now have '0' object in it as specified.


        //* METHODS TO TRANSACT ETHER

        //* 1. 'transfer' method 
        //? Here 'msg.sender' needs to be typecaseted from an address type to a 'payable' address type. 'address(this).balance' is the current balance of this contract.
        //? Capped at 2300 gas
        //? It reverts state when transaction fails.
        // payable(msg.sender).transfer(address(this).balance);

        //* 2. 'send' method
        //? Capped at 2300 gas
        //? doesn't revert the state upon transaction failure.
        //? Have to use a require statement to check if transaction passed or failed.
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");

        //* 3. 'call' method
        //? Lower level command, gas limit can be set or forwarded
        //? We can pass ether value of the transaction within {}
        //? Returns two varibles: a bool, and a bytes memory object with the data it returns from a function call.

        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }

    fallback() external payable {
        fund(); //calling 'fund' function in case 'fallback' is triggered. This means the trasaction must be at least 'MINIMUM_USD' otherwise it will be reverted.
    }

    receive() external payable {
        fund(); //calling 'fund' function in case 'receive' is triggered.
    }

}

/*
    Explainer from: https://solidity-by-example.org/fallback/

    Ether is sent to contract
         is msg.data empty?
             /   \ 
            yes  no
            /     \
       receive()?  fallback() 
        /   \ 
      yes   no
     /        \
    receive()  fallback()

*/




