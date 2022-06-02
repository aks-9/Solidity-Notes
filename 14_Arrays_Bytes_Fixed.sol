// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

/*  
    1 byte = 2 hexadecimal digits
    1 hexadecimal digit = 4 bits
     so 1 byte = 8 bits 

     Everything stored in a byte array is in the form of hexadecimal digits.

     Length of bytes array: bytes1, byetes2, bytes3.... bytes32.

     A bytes1 array will have 8 bits, or 2 hexadecimal digits.
     A bytes2 array will have 16 bits, or 4 hexadecimal digits.
     A bytes3 array will have 24 bits, or 6 hexadecimal digits.

     We don't use [] for bytes array.

     Default values are 0, as we don't have 'null' or 'none' in solidity.


    */ 

contract Arrays
{
    bytes1 public b1; // 1 byte size array, i.e. 2 hexadecimal digits.
    bytes2 public b2; // 2 byte size array, i.e. 4 hexadecimal digits.
    bytes3 public b3; // 3 byte size array, i.e. 6 hexadecimal digits.
    bytes4 public b4; // 4 byte size array, i.e. 8 hexadecimal digits.

    function setter() public
    { 
        b1 = 'a'; //The size of 'b1' bytes array is 1 byte. In ASCII, the hexadecimal value of 'a' is 61. So at index = 0, we have the hexadecimal value of 'a' stored in 'b1' bytes array.

        b2 = 'ab'; //The size of 'b2' bytes array is 2 bytes. In ASCII, the hexadecimal value of b is 62.  So at index = 0, we've the hexadecimal value of 'a'; and at index = 1, we've the hexadecimal value of 'b' stored in 'b2' bytes array. So here we're storing 'a' and 'b' in each byte of the 'b2' array.

        b3 = 'abc';//The size of b3 is 3 bytes, so similarly we're storing hexadecimal values of 'a', 'b' and 'c' in each byte of 'b3' bytes array.

        b4 = 'abc'; // Here the size of b4 is 4 bytes, but if we only store 3 hexadecimal values in it, then we will have padding of 0s in this byte array, as the provided value didn't occupy all of the available space in the array.

        /* Byte arrays are immutable, that means once we set the value of a byte array, we can not change the value of a particular index. e.g. We can't change the value of an element at index = 0 in b3:
        b3[0] = 'd'; This will give error.
        */
    }

}
