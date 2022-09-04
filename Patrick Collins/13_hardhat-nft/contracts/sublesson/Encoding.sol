//* 23. Intro to 'abi.encode' & 'abi.encodePacked'

// create a new folder, 'subesson' in the 'contracts' folder, then create a new contract called 'Encoding.sol'

//* This is 'Encoding.sol' file.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Encoding {
    function combineStrings() public pure returns (string memory) {
        return string(abi.encodePacked('Hi Mom! ', 'Miss you.')); // Here we're using the 'abi.encodePacked()' function, to concatenate the strings 'Hi Mom! ' and 'Miss you.'
        // The 'abi.encodePacked()' function returns a 'bytes' object, so we are converting it into a string by typecasting it, using the 'string()' function.

        //* 'abi.encodePacked' is one of globally available methods and units.
        // More in cheatsheet: https://docs.soliditylang.org/en/v0.8.13/cheatsheet.html?highlight=encodewithsignature

        //* in Solidity compiler ^0.8.12, we can concatenate two strings easily:
        // string.concat(stringA, stringB);

        // The 'binary code' generated after contract compilation, is stored in the 'bytecode', in an element called 'object'. When we send a transaction, this 'binary code' is sent to the blockchain, under the transaction's data field.

        // When we deploy a contract, the 'TO' field is empty. And  the 'data' field has a 'contract init code' and the 'bytecode', both of which are then converted to a single binary code and sent to blockchain.

        // Now finally this binary code is converted into 'opcodes' which are low level machine instructions to perform a predefined operation. And an EVM, or Ethereum Virtual Machine can read these opcodes and execute them on the blockchain.
    }

    //* An opcode is going to be 2 characters that represents some special instruction, and also optionally has an input

    // You can see a list of there here:
    // https://www.evm.codes/
    // Or here:
    // https://github.com/crytic/evm-opcodes

    // This opcode reader is sometimes abstractly called the EVM - or the ethereum virtual machine.
    // The EVM basically represents all the instructions a computer needs to be able to read.
    // Any language that can compile down to binary and then to these opcodes is considered EVM compatible
    // Which is why so many blockchains are able to do this - you just get them to be able to understand the EVM and presto! Solidity smart contracts work on those blockchains.

    // Now, just the binary can be hard to read, so why not press the `assembly` button? You'll get the binary translated into the opcodes and inputs for us!
    // We aren't going to go much deeper into opcodes, but they are important to know to understand how to build more complex apps.

    // How does this relate back to what we are talking about?
    // Well let's look at this encoding stuff

    // In this function, we encode the number 1 to what it'll look like in binary
    // Or put another way, we ABI encode it.
    // This returns a 'bytes' object which gives us the binary version of the number 1. It will be in hexadecimal format, which has 16 digits after '0x'.
    // 0x0000000000000001
    function encodeNumber() public pure returns (bytes memory) {
        bytes memory number = abi.encode(1);
        return number;
    }

    // You'd use this to make calls to contracts
    //* The function 'abi.encode' returns the binary version of this string, which will have a lot of 0s.
    function encodeString() public pure returns (bytes memory) {
        bytes memory someString = abi.encode('some string');
        return someString;
    } //*  0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b736f6d6520737472696e67000000000000000000000000000000000000000000

    //* We can save space by removing all these 0s. This is done by another function called 'abi.encodePacked'

    //* 'abi.encodePacked' function
    // This is great if you want to save space, not good for calling functions.
    // You can sort of think of it as a compressor for the massive bytes object above.
    function encodeStringPacked() public pure returns (bytes memory) {
        bytes memory someString = abi.encodePacked('some string');
        return someString;
    } //* This return the binary version of the same string as : 0x736f6d6520737472696e67

    // This is just type casting to string
    // It's slightly different from 'abi.encodePacked', and they have different gas costs
    function encodeStringBytes() public pure returns (bytes memory) {
        bytes memory someString = bytes('some string'); // this will also give the same result as 'abi.encodePacked' but in the backend they are a little different.abi
        // https://forum.openzeppelin.com/t/difference-between-abi-encodepacked-string-and-bytes-string/11837
        return someString;
    }

    //* For DECODING
    // using 'abi.decode()', take as parameter an encoded message, and the type of variable we want to decode the message into. Here we're decoding the output of 'encodeString' function, and want the result as a 'string'.
    function decodeString() public pure returns (string memory) {
        string memory someString = abi.decode(encodeString(), (string));
        return someString;
    } // this will give the output: 'some string'

    //* MULTI - ENCODE and DECODE
    function multiEncode() public pure returns (bytes memory) {
        bytes memory someString = abi.encode('some string', "it's bigger!");
        return someString;
    } //*  0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000b736f6d6520737472696e67000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c6974277320626967676572210000000000000000000000000000000000000000

    // Gas: 24612
    function multiDecode() public pure returns (string memory, string memory) {
        (string memory someString, string memory someOtherString) = abi.decode(
            multiEncode(),
            (string, string)
        );
        return (someString, someOtherString);
    } /* 
    0: string: some string
    1: string: it's bigger! 
    */

    // This will give us packed version of the encoded data to save space.
    function multiEncodePacked() public pure returns (bytes memory) {
        bytes memory someString = abi.encodePacked(
            'some string',
            "it's bigger!"
        );
        return someString;
    }

    // This doesn't work! As the packed version can't be decoded back. So this will give an error.
    function multiDecodePacked() public pure returns (string memory) {
        string memory someString = abi.decode(multiEncodePacked(), (string));
        return someString;
    }

    // This does work! As the typecasting into string is similar to packed encoding.
    // Gas: 22313
    function multiStringCastPacked() public pure returns (string memory) {
        string memory someString = string(multiEncodePacked());
        return someString;
    } //* This gives us: some stringit's bigger!

    //* As of 0.8.13, you can now do `string.concat(string1, string2)`

    // This abi.encoding stuff seems a little hard just to do string concatenation... is this for anything else?
    // Why yes, yes it is.
    // Since we know that our solidity is just going to get compiled down to this binary stuff to send a transaction...

    //* We could just use this superpower to send transactions to do EXACTLY what we want them to do...

    // Remeber how before I said you always need two things to call a contract:
    // 1. ABI
    // 2. Contract Address?
    // Well... That was true, but you don't need that massive ABI file.
    //* All we need to know is how to create the binary to call the functions that we want to call.

    // Solidity has some more "low-level" keywords, namely "staticcall" and "call". We've used call in the past, but haven't really explained what was going on. There is also "send"... but basically forget about send.

    //* call: How we call functions to change the state of the blockchain.
    //* staticcall: This is how (at a low level) we do our "view" or "pure" function calls, and potentially don't change the blockchain state.

    // When you call a function, you are secretly calling "call" behind the scenes, with everything compiled down to the binary stuff for you. Flashback to when we withdrew ETH from our raffle:

    // Remember this?
    function withdraw(address recentWinner) public {
        (bool success, ) = recentWinner.call{value: address(this).balance}('');
        require(success, 'Transfer Failed');
    }

    // - In our {} we were able to pass specific fields of a transaction, like 'value'.
    // - In our () we were able to pass 'data' in order to call a specific function - but there was no function we wanted to call!
    // We only sent ETH, so we didn't need to call a function!
    // If we want to call a function, or send any data, we'd do it in these parathesis!

    // Let's look at next contract to explain this more...
}
