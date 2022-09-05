//* 24. Encoding Function Calls Directly- 1

// This is 'CallAnything.sol' file.

//* So why do we care about all this encoding stuff?

// In order to call a function using only the data field of call, we need to encode the following, down to their binary level:
// 1. The function name
// 2. The parameters we want to add

//* We will encode the function name, like "transfer(address , uint256)", to get a "function signature", which is a long string that defines the function name & parameters:
// function signature:  0xa9059cbb00000000000702984h290t8u20945hi7gfes90h3409h3498h398r8h3498t338ho9e

// The "function selector" is the first 4 bytes of the "function signature":
// function selector: 0xa9059cbb

// In each contract, this "function selector" is assigned to each of its functions, as a function ID.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract CallAnything {
    address public s_someAddress;
    uint256 public s_amount;

    function transfer(address someAddress, uint256 amount) public {
        // Some code
        s_someAddress = someAddress;
        s_amount = amount;
    }

    // This function returns the 'function selector' of the 'transfer(address,uint256)' function. Notice we used 'bytes4' as a return type, because we only want the first four bytes from the 'function signature'.
    function getSelectorOne() public pure returns (bytes4 selector) {
        selector = bytes4(keccak256(bytes('transfer(address,uint256)'))); //encoding the function 'transfer(address,uint256)' with keccak256, which gives us the 'function signature'. Then taking the first four bytes and saving it into variable 'selector'.

        //* Notice we didn't use the 'return' keyword. The variable 'selector' is auto returned.
    }

    // Now we can call the 'transfer' function directly and pass its own 'function selector: 0xa9059cbb' in the 'address' parameter while calling it, and let's say pass 777 in the 'amount' parameter. Then this function will call itself, and update the state variables 's_someAddress' to '0xa9059cbb' and 's_amount' to 777.

    //* Now we can also encode a function along with the arguments/parameters passed to it, and get a 'function signature' and then from it, the 'function selector'.
    function getDataToCallTransfer(address someAddress, uint256 amount)
        public
        pure
        returns (bytes memory)
    {
        return abi.encodeWithSelector(getSelectorOne(), someAddress, amount); // passing the parameters along with the function to encode it with the selector, using 'abi.encodeWithSelector' function.
        //* Notice we're calling 'getSelectorOne()' in the parameter/argument of 'encodeWithSelector' function. This will pass the result of calling 'getSelectorOne()' as a parameter to 'encodeWithSelector' function.

        // The result of this 'getDataToCallTransfer' function call, can be used populate the data field of a transaction, which will call the 'transfer' function of this contract with 'someAddress' , 'amount' as parameters that we've passed in this 'getDataToCallTransfer' function.
    }

    //* How can we use the function selector to call our transfer function ?
    function callTransferFunctionDirectly(address someAddress, uint256 amount)
        public
        returns (bytes4, bool)
    {
        (bool success, bytes memory returnData) = address(this).call(
            // getDataToCallTransfer(someAddress, amount);
            abi.encodeWithSelector(getSelectorOne(), someAddress, amount)
        );
        //* returnData' is the data returned by calling the 'transfer' function on this contract.

        return (bytes4(returnData), success);
    }

    // Using 'encodeWithSignature' to do the same thing as above function. The only difference is we're passing that function which we want to call in a readable signature form instead of the binary form returned by getSelectorOne().
    function callTransferFunctionDirectlyTwo(
        address someAddress,
        uint256 amount
    ) public returns (bytes4, bool) {
        (bool success, bytes memory returnData) = address(this).call(
            abi.encodeWithSignature(
                'transfer(address,uint256)',
                someAddress,
                amount
            )
        );
        return (bytes4(returnData), success);
    }

    //* a bunch of other ways to get the function selector.
    // We can also get a function selector from data sent into the call
    function getSelectorTwo() public view returns (bytes4 selector) {
        bytes memory functionCallData = abi.encodeWithSignature(
            'transfer(address,uint256)',
            address(this),
            123
        );
        selector = bytes4(
            bytes.concat(
                functionCallData[0],
                functionCallData[1],
                functionCallData[2],
                functionCallData[3]
            )
        );
    }

    //* Another way to get data (hard coded)
    function getCallData() public view returns (bytes memory) {
        return
            abi.encodeWithSignature(
                'transfer(address,uint256)',
                address(this),
                123
            );
    }

    // Pass this:
    // 0xa9059cbb000000000000000000000000d7acd2a9fd159e69bb102a1ca21c9a3e3a5f771b000000000000000000000000000000000000000000000000000000000000007b
    // This is output of `getCallData()`
    // This is another low level way to get function selector using assembly
    // You can actually write code that resembles the opcodes using the assembly keyword!
    // This in-line assembly is called "Yul"
    // It's a best practice to use it as little as possible - only when you need to do something very VERY specific
    function getSelectorThree(bytes calldata functionCallData)
        public
        pure
        returns (bytes4 selector)
    {
        // offset is a special attribute of calldata
        assembly {
            selector := calldataload(functionCallData.offset)
        }
    }

    // Another way to get your selector with the "this" keyword
    function getSelectorFour() public pure returns (bytes4 selector) {
        return this.transfer.selector;
    }

    // Just a function that gets the signature
    function getSignatureOne() public pure returns (string memory) {
        return 'transfer(address,uint256)';
    }
}
