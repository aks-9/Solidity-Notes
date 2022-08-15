//* Gas Optimization using Storage knowledge -1

// Every time we read and write from 'storage' it costs us a lot of 'gas'.

// 'bytecode' and 'opcodes' are generated when we compile our contract. Gas calculation is done on the basis of what 'opcodes' are used in the contract. They represent what the machine code is doing. They decide how much computation work is required to run anything in our contract.

/*

http://github.com/crytic/evm-opcodes

Opcode	Name	Description	           Extra Info	Gas

0x54    SLOAD	Load word from storage	-	        800
0x55	SSTORE	Save word to storage    -           20000**

Each opcode operation corrosponds to a certain amount of gas units. The total gas is calculated by combing all the gas units.

The SLOAD and SSTORE opcodes cost a lot of gas. They are the read and write operations from and to the 'storage'.
*/

// SPDX-License-Identifier: MIT
//* 1. Pragma
pragma solidity ^0.8.0;

//* 2. Imports
import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';
import './PriceConverter.sol';

//* 3. Errors, Interfaces, Libraries, Contracts
error FundMe__NotOwner();

//* NatSpec comment
/**@title A sample Funding Contract
 * @author Patrick Collins
 * @notice This contract is for creating a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FundMe {
    //* Type Declarations
    using PriceConverter for uint256;

    // Constants and Immutables are cheaper in terms of gas than the 'storage' variables.

    //* State variables
    uint256 public constant MINIMUM_USD = 50 * 10**18; // constant values are in ALL CAPS
    address public immutable i_owner; // prefixing 'i_' to indicate an immutable variable.
    address[] public s_funders; // prefixing 's_' to indicate a storage variable.
    mapping(address => uint256) public s_addressToAmountFunded;
    AggregatorV3Interface public s_priceFeed;

    //* Events (we have none!)

    //* Modifiers
    modifier onlyOwner() {
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
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
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            'You need to spend more ETH!'
        );

        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    function withdraw() public payable onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length; // reading from storage
            funderIndex++
        ) {
            address funder = s_funders[funderIndex]; // reading from storage
            s_addressToAmountFunded[funder] = 0; // writing to storage
        }
        s_funders = new address[](0); // writing to storage

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }('');
        require(callSuccess, 'Call failed');
    }

    //* This will be a lot cheaper than the normal 'withdraw' function
    function cheaperWithdraw() public onlyOwner {
        address[] memory funders = s_funders; // reading just one time from storage and saving it in a memory variable called 'funders'. For all successive steps where we need to read from 's_funders', now we'll just read from 'funders'. This will help save gas.

        //!  mappings can't be in memory, sorry!

        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length; // reading from 'memory' variable.
            funderIndex++
        ) {
            address funder = funders[funderIndex]; // reading from 'memory' variable.
            s_addressToAmountFunded[funder] = 0; //writing to storage just once.
        }
        s_funders = new address[](0); //writing to storage just once.

        (bool success, ) = i_owner.call{value: address(this).balance}('');
        require(success);
    }
}

/*

*/
