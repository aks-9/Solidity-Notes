// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

/*
PUBLIC    PRIVATE    INTERNAL    EXTERNAL

Outside      x         x        Outside
Within    Within    Within         x
Derived      x      Derived     Derived
Other        x         x        Other

*/

contract A
{
    //When we deploy this contract, only f1 and f4 will be visible in Remix IDE, as Remix is an outside environment. Only Public and External visibility functions are visible to outside environment. So only f1 and f4 will be visible.
    function f1() public pure returns(uint)
    {
        return 1;
    }

    function f2() private pure returns(uint)
    {
        return 2;
    }

    function f3() internal pure returns(uint)
    {
        // uint x = f4(); This will give error.
        // External function can't be called within the contract. Public, Private and Internal can be called within the contract.
        uint y = f1(); //f1 can be called as it is public.

        return 3;
    }

    function f4() external pure returns(uint)
    {
        return 4;
    }
    //Public and External will be visibile to outside environment like Remix IDE.
}

//Deriving is similar to inheritence in OOPS. All functions and variables of A will be available to B.

contract B is A
{
    // uint bx = f2();
    // This is giving error as f2 is a private function, and private functions can't be derived. Only public, internal, and external functions are derived.
     uint public bx = f3();// f3 is accessible but as it is internal, but it is not visible on deployment in contract B, as internal functions are not visible to outside environment.

    //  uint public by = f4();
    //This is giving error as although f4 is visible upon deriving the contract, but it is not accessible, because external functions can't be accessed within the contract. When contract B derived contract A, it in a way now has f4 in contract B as well. So as f4 is now in contract B, it can't be accessed within contract B as it is an external function.

    uint public by = f1();

    //The internal functions while are not visible when derived, but they are accessible, e.g. f3(). And the external functions while are visible when derived, but they aren't accessible, e.g. f4().

}

//For other contract we have to create an object.
contract C
{
    A obj = new A(); //creating an object of contract A.
    uint public cx = obj.f4(); // f4 is external, and has 'other' visibility.

    // uint public cx = obj.f2(); This will give error as f2 is private, and doesn't have 'other' visiblity.

}

