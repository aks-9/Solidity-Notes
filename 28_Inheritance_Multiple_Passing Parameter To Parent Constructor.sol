// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;


contract A{
    uint public age;
    string public name;

    constructor(string memory _name, uint _age){
        name = _name;
        age = _age;
    }

}

contract B {
    uint public salary;
    string public add;

    constructor(string memory _add, uint _salary){
        salary = _salary;
        add = _add;
    }

}
//passing parameters to parent constructors in a FIXED manner(1).
contract C is A("Ashish", 33),B("Delhi",50000){

} //order of execution of parent constructor: A,B,C


//passing parameters to parent constructors in a FIXED manner(2).
contract D is A,B {
    constructor() A("Ashish", 33) B("Delhi",50000){ //Notice there is no comma between A and B.

    }
} //order of execution of parent constructor: B,A,D

//passing parameters to parent constructors in a DYNAMIC manner.
contract E is A,B{
    constructor(string memory _name, uint _age,string memory _add, uint _salary) A(_name,_age) B(_add,_salary){
        //passing _name and _age to contructor of A.
        //passing _add and _salary to contructor of B. We can also pass _salary+1000 or any other logic.

    }
}

//passing parameters to parent constructors of A in a FIXED manner and of B in a DYNAMIC manner.
contract F is A("Ashish", 33),B{
    constructor(string memory _add, uint _salary) B(_add,_salary){
        //passing _name and _age to contructor of A.
        //passing _add and _salary to contructor of B. We can also pass _salary+1000 or any other logic.

    }
}

///Order of inheritence of contracts is Order of execution of parent constructors, and not how we are passing values.

//order of execution of parent constructor: A,B,G
contract G is A,B{
    string public a;
    constructor(string memory _name, uint _age,string memory _add, uint _salary, string memory _a) A(_name,_age) B(_add,_salary){
        a = _a;

    }
}

//https://www.youtube.com/watch?v=nFVFOPrP6Dw&list=PL-Jc9J83PIiG6_thChXWzolj9BEG-Y0gh&index=32





