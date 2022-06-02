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
    function fun() public pure virtual returns(string memory){
        return "I'm in A.";
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
    function fun() public pure virtual override returns(string memory){
        return "I'm in B.";
    }


}

contract C is A,B{
    //A and B both are parents for C. Both have same function fun() in them. So to use fun() in contract C, we must override fun() by using parenthesis() and mentioning both A and B. Order is not important.

    function fun() public pure virtual override(A,B) returns(string memory){
        return "I'm in C.";
    }

}

contract D is A,B,C{
    function fun() public pure virtual override(C,A,B) returns(string memory){ //Order is not important.
        return "I'm in D.";
    }

}

