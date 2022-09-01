// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract fib1 {

    uint[] fib;

    function printFib(uint n) public pure returns (uint){
        
        if ( n < 1){
            return 0;
        }
        
        uint a = 1;
        uint b = 1;

            for(uint i = 2; i < n; i++){
                uint c = a + b;

                a = b;
                b = c;
            }

        return b;
    }
}

contract fib2 {

    function fibonacci(uint256 n) public pure returns (uint256[] memory) {
        require(n > 1, "n must be > 1");

        uint256[] memory sequence = new uint256[](n + 1);

        // Fib(0) = 0
        sequence[0] = 0;

        // Fib(1) = 1
        sequence[1] = 1;

        // Fib(n) = Fib(n - 1) + Fib(n - 2)
        for (uint256 i = 2; i < sequence.length; i++) {
            sequence[i] = sequence[i - 1] + sequence[i - 2];
        }

        return sequence;
    }
}


    




