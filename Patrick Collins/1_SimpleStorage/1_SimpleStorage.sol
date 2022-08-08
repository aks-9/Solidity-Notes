// I'm a comment!
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;
// pragma solidity ^0.8.0;
// pragma solidity >=0.8.0 <0.9.0;

contract SimpleStorage {

    uint256 favoriteNumber;

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    // uint256[] public anArray;
    People[] public people; //crating an array named 'people' of type 'People', which is a struct. This means that each element of the array 'people' will have a new 'People' struct.

    function store(uint256 _favoriteNumber) public {
        favoriteNumber = _favoriteNumber;
    }
    
    function retrieve() public view returns (uint256){
        return favoriteNumber;
    }

    mapping(string => uint256) public nameToFavoriteNumber;

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        people.push(People(_favoriteNumber, _name)); //adding the '_favoriteNumber' and '_name' to the array using the 'push' method for arrays.
        nameToFavoriteNumber[_name] = _favoriteNumber; //adding the '_name' to mapping 'nameToFavoriteNumber' and setting it to '_favoriteNumber' So we will be able to get a favourite number of a particular name.
    }
}