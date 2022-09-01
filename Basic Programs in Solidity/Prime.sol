// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

//Write a contract to check whether a number is prime.

contract Practice {


    function checkPrime(uint num) public pure returns(bool) {
        bool isPrime = true;                
        
            for( uint i = 2; i < num; i++){
                if ( num % i == 0){
                    isPrime = false; 
                }                                   
            }      
        
        return isPrime;
    }

    
    function isPrimeNumber(uint number) public pure returns (string memory){
        for( uint i = 2; i < number; i++) {
            if (number % i == 0)
            return "Not a prime";
        }

    return "Number is a prime";
}

}


    




