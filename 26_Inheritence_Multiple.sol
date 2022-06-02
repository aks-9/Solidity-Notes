// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;


contract A{ 
    uint public a;

    constructor(){
        a = 100;
    } 

    function funA() virtual public {
        a= 10;        
    }
    
} 

contract B is A{ 
    uint public b;
    constructor(){
        b = 200;
        a=50;
    } 

    function funB() virtual public {
        b= 20;        
    }
    
} 

contract C is A,B{ //order of writing is 'Most Base-like to  Most Derived'.
    //order of fetching properties is 'right to left, Depth first manner'.

    //C will fetch the properties of B first, then it will fetch all the properties of all the parents of B. In this case B's parent is A, so it will now fetch the properties of A. Now will go from 'left to right' an try to inherit A. But it has already inherited the properties of A through B, so it will not inherit again.

    //Whoever comes first will dominate.
    
} 


//https://www.youtube.com/watch?v=zbmgECeO14c&list=PL-Jc9J83PIiG6_thChXWzolj9BEG-Y0gh&index=30
