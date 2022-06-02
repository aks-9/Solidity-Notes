// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract Local
{ 
    //Local variables are defined inside the function body and are stored in stack instead of storage.

    function store() pure public returns(uint)
    {
       string memory name = 'Ravi';
       uint age = 15; //local variable age
       return age; 
    }
            //'pure' is used to indicate that this function is not making any changes to the state varibles nor it is reading the state variables. While declaring a function, we have to specify what kind of datatype does this function is going to return using the 'returns' keyword. eg. returns(uint)

            //By default string datatype is stored in storage, but if we have to use them in a function, we have to store them in 'memory'. Therefore we use 'memory' keyword while defining a string in a function.

            //memory keyword can't be used in contract level.
    
}
