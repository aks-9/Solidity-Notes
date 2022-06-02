// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;


contract A{
    event log(string name, uint age);

    function fun1() public virtual{
        emit log("A.fun1", 30);
    }

    function fun2() public virtual{
        emit log("A.fun2", 20);
    }


}

contract B is A {
    function fun1() public virtual override{
        emit log("B.fun1", 30);

        //Direct calling of parent's function. We call the function of a SPECIFIC parent.
        A.fun1();
    }

    function fun2() public virtual override{
        emit log("B.fun2", 20);

        //SUPER calling of parent's function.We call the function of a IMMEDIATE parent and if found it will stop, otherwise it'll keep searching in other parent contracts for the function.
        super.fun1(); //SUPER also work in RIGHT to LEFT, and Depth First manner.
    }



}

contract C is A{
    function fun1() public virtual override{
        emit log("C.fun1", 30);
    }

    function fun2() public virtual override{
        emit log("C.fun2", 20);
    }

}

contract D is B,C { //We can change this order as B and C both are same base like. Then Super will call IMMEDIATE parent, starting from RIGHT to LEFT.
    function fun1() public override(B,C){
        emit log("D.fun1", 30);
    }

    function fun2() public override(B,C){
        emit log("D.fun2", 20);
    }

}

