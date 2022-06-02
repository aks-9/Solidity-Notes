// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract map
{
    //Concept of keys and values. The keys are mapped to the values.
    //Mapping is based on hashing. No sequential order is required.
    //Mapping is used instead of an array, as mapping takes less space in memory than an array.

    //SYNTAX: mapping(keys_datatype => values_datatype) public varible_name;

    mapping(uint => string) public enroll_no;

    // Associating one particular key(roll number) with one particular value(name)using a setter function.
    function setter(uint key1, string memory value1) public
    {
        enroll_no[key1]=value1; //putting value for the key in the mapping of enroll_no
    }
}

 //While calling this setter function, make sure to pass the string under "" after the key. eg. 5,"Ravi".

