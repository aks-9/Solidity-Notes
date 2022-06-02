// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract local
{

    /*
1. int has both positive & negative values but uint has only positive values.

2. various sizes available. from 8 bit to 256 bits. int8 to int256 and uint8 to uint256

3. Sizes: int8,int16,int24.... int256.

4. int means int256 by default. Same for uint.

5.By default int is initialized to 0.

6. Overflow gets detected at compile time.
Range for int8: -128 to +127
Formula: -2^(n-1)  to  2^(n-1) -1

Range for uint8: 0 to 255.
Formula: 0  to  2^(n) -1



    */

    int8 count1 = 127; //valid
    int8 count2 = 128; //Invalid, out of range.
    uint count3 = 255; //valid
    uint8 count4 = 256; //Invalid, out of range.
    int16 count5 = 128; //valid

    uint count6 = -1; //Invalid, signed value can't be used for uint.


}
