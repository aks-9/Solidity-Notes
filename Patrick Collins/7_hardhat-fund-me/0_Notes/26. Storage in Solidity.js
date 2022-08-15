//* Storage in Solidity

/*
1. Enable the gas-reporter in 'hardhat.config.js' file.

2. 'yarn hardhat test' will run our all tests,  generate a new gas report and save it in 'gas-report.txt' in the root of the project.

* 3. What happend when we declare a 'global' or 'storage' variable?

=> Whenever we have these 'global' variables in our contract, they are permanent in nature and are placed in a data location called 'storage'. You can think of 'storage' as a giant list/ array of all the variables that we create.

==> For example, let's say we have a 'uint256 variable = 25' declared as a global variable. The way it persists, is that it gets stored in this place called 'storage', where every single variable or value is slotted into a 32 bytes long slot. They are stored as hexadecimal numbers, which is also called a bytes implementation.

===> And each storage slot increments just like an array, starting from zero. So let's say we have a next 'storage' variable of type 'bool variableName = true'. Then it will be transformed from a 'bool' version to its 'hex' version, and get slotted at the next slot that is available. 

====> Every time you create a new 'storage' variable, it will take up a new storage slot.


* 4. What about dynamic variables? Those that can change length?

=> For a dynamic varible, like a dynamic array or mapping, the object itself will take a slot but its not going to be the entire array or mappin. Only their length is stored in a slot. The elements inside them are stored using some kind of hashing function, at the location of the hashing function in the storage.

==> This makes sure that even if the size of the dynamic array changes, it doesn't take new slots in the storage.

===> For mappings, a sequential storage slot is taken, but is left blank intentionally.


* 5. Constants and Immutables

They are not stored in the 'storage' but are stored in a different data location called 'bytecode'. So for every 'constant' varible name, Solidity swaps it with whatever number it is. So it kinda works like a pointer to the value.


* 6. Variables inside a function

They exist only for the duration/ scope of the function. They don't persist, and are not permanent. They don't get added to 'storage'. They get added to 'memory' data location, which gets deleted after the function has finished running.

* 7. Purpose of 'memory' keyword.

Whenever we use a 'string' in a function, we have to specify the 'memory' keyword. This is because 'string' is technically a dynamic array. So we have to specify where is it going to be stored, whether in the 'storage' or in the 'memory'.






*/
