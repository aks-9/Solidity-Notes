//* Solidity Style Guide

// SPDX-License-Identifier: MIT
//* 1. Pragma
pragma solidity ^0.8.0;

//* 2. Imports
import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';
import './PriceConverter.sol';

//* 3. Errors, Interfaces, Libraries, Contracts
error NotOwner();

//* NatSpec comment
/**@title A sample Funding Contract
 * @author Patrick Collins
 * @notice This contract is for creating a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FundMe {
    //* Type Declarations
    using PriceConverter for uint256;

    //* State variables
    uint256 public constant MINIMUM_USD = 50 * 10**18;
    address public owner;
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;
    AggregatorV3Interface public priceFeed; // adding a new varible of type AggregatorV3Interface.

    //* Events (we have none!)

    //* Modifiers
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    //* Functions Order:
    // constructor
    // receive
    // fallback
    // external
    // public
    // internal
    // private
    // view / pure

    constructor(address priceFeedAddress) {
        // Now the contructor will take 'priceFeedAddress' depending on the chain.
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress); //setting the 'priceFeed' to the input address, instead of hard coding it in 'getPrice' function of 'PriceConvertor.sol'.
    }

    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }

    /// @notice Funds our contract based on the ETH/USD price
    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD, //passing 'priceFeed' as an argument
            'You need to spend more ETH!'
        );

        addressToAmountFunded[msg.sender] += msg.value;
        funders.push(msg.sender);
    }

    function withdraw() public payable onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }('');
        require(callSuccess, 'Call failed');
    }
}

/*

*/
