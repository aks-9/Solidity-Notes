// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

//Struct datatype is a user defined datatype. It is a complex datatype. It can contain multiple types of datatypes in it.
// Structure can be created outside or inside the contract storage.

struct Student //Creating a structure called Student. It has two datatypes in it. Notice the small case of struct keyword.
{
    uint roll;
    string name;
}

contract Demo
{
    Student public s1; //Creating a variable s1 of type Student.

    //Initializing the values of s1 using a constructor.
    constructor(uint _roll, string memory _name) public
    {
        s1.roll = _roll;
        s1.name = _name;

    }

    //If we need to use struct datatype in a function, we have to use 'memory' keyword, like we use in the case of a string.

    //To change the values of structure Student, we have to use a function. In this function we'll first make a new vaiable called new_student and then copy the newly set values of old structure into new_student.

    function change(uint _roll, string memory _name) public
    {
        //Copying the Student into new_student.
        Student memory new_student = Student({
            roll:_roll,
            name:_name //no comma at the end.
        });

        s1=new_student; //Copying new_student into s1.


    }
}
