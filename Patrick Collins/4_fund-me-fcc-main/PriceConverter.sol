// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// Why is this a library and not abstract?
// Why not an interface?

//* Libraries
/*
- Similar to contracts, but you can't declare any state variable and you can't send ether.

- embedded into the contract if all library functions are 'internal'. Otherwise the library must be deployed and then linked before the contract is deployed.

- adds more functionalities to different values like uint256, array or struct etc.
*/

// This library will be attached to uint256.
library PriceConverter {
    // We could make this public, but then we'd have to deploy it
    function getPrice() internal view returns (uint256) {
        // Rinkeby ETH / USD Address
        // https://docs.chain.link/docs/ethereum-addresses/
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        );

        // 'latestRoundData' function returns multiple values, but we need only the second value, that is 'int256 answer'
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        // ETH/USD rate in 18 digit
        return uint256(answer * 10000000000); // multiplied by 1e10 so that we can get value of ETH in USD in same decimal places. Right now our 'answer' has on 8 decimal places, so we multiplied it by 10 more decimal places. Also doing Typecasting 'int256' into 'uint256'.
    }

    // 1000000000
    function getConversionRate(uint256 ethAmount)
        internal
        view
        returns (uint256)
    {
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1000000000000000000; // Always multiply and then divide.

        // the actual ETH/USD conversion rate, after adjusting the extra 0s.
        return ethAmountInUsd;
    }
}
