// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;


contract A{
    uint public a = 100;
    address public owner = msg.sender;

    function fun1() public pure returns(string memory){
        return "I'm in A";

    }
    function fun2() public pure returns(string memory){
        return "I'm in A";

    }
    function fun3() public pure virtual returns(string memory){
        return "I'm in A";

    }
    function fun4() public pure virtual returns(string memory){
        return "I'm in A";

    }

}

contract B is A{ //inheriting from contract A

    function fun3() public pure override returns(string memory){
        return "I'm in B";//Overriding fun3() in contract A.

    }
    function fun4() public pure virtual override returns(string memory){
        return "I'm in B"; //Overriding fun4() in contract A. We're also using 'virtual' to allow any contract that inherits B, to override this fun4().

    }

}

contract C is B{ //inheriting from contract B

    function fun4() public pure override returns(string memory){
        return "I'm in C"; //Overriding fun4() in contract B.

    }
}

