//* Chainlink Style Guide- 1

// * change the visibility of certain 'public' variables/functions to 'internal' or 'private' to save gas and increase readability for other users. Also create 'getters' at the end for these 'private' functions.

// This is 'contracts/FundMe.sol' file.

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

    //* State variables
    uint256 public constant MINIMUM_USD = 50 * 10**18; // we want everybody to know about minimum contribution, so it is still 'public'.
    address private immutable i_owner; // making it private.
    address[] private s_funders; // making it private.
    mapping(address => uint256) private s_addressToAmountFunded;
    AggregatorV3Interface private s_priceFeed;

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
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }('');
        require(callSuccess, 'Call failed');
    }

    function cheaperWithdraw() public onlyOwner {
        address[] memory funders = s_funders;

        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);

        (bool success, ) = i_owner.call{value: address(this).balance}('');
        require(success);
    }

    //* GETTERS

    /** @notice Gets the amount that an address has funded
     *  @param fundingAddress the address of the funder
     *  @return the amount funded
     */
    function getAddressToAmountFunded(address fundingAddress)
        public
        view
        returns (uint256)
    {
        return s_addressToAmountFunded[fundingAddress];
    }

    function getVersion() public view returns (uint256) {
        return s_priceFeed.version();
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}

/*

*/
