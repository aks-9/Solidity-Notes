// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

//Mapping a uint to a structure.

contract map2
{
    struct Student //creating a structure.
    {
        string name;
        uint class;

    }

    mapping(uint => Student) public data; //Student represents the datatype of a structure.

    function setter(uint _roll, string memory _name, uint _class) public
    {
        data[_roll]= Student(_name, _class);//_roll is the key, and _name and _class are the values mapped to it.
    }

    //The keys can't be of the following datatype: mapping, enum, struct and dynamic array.
    //The values can be of any datatype.
    //Mappings are always stored in contract storage, even if they are created in a function or in other words, irrespective of if they are declared in contract storage or not.
    //They cost gas.

}
