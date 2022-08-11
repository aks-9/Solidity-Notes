//* Hardhat tasks

// Hardhat comes with a number of tasks, and we can also add our custom tasks. They can be written in 'hardhat.config.js' file, but we will make a separate folder called 'tasks' in the root of the project and then add our tasks there. This will keep our code clean and organized.

//* This is './tasks/block-number.js' file.

// Tasks are similar to scripts, but tasks are better used for plugins while scripts are better used for development.

// You can list all the tasks available in the hardhat by running 'yarn hardhat'

const { task } = require('hardhat/config'); //importing the 'task' function.

//* Defining a task.
// 'block-number' is the name of the task, followed by its description. Then calling the '.setAction' method to define what this task will do.
task('block-number', 'Prints the current block number').setAction(
    // const blockTask = async function() => {}
    // async function blockTask() {}
    async (taskArgs, hre) => {
        //using anonymous arrow function

        // 'hre' stands for 'hardhat runtime environment'. It can access a lot of packages that 'hardhat' package can. So we'll use 'hre' to access 'ethers' that can allow us to get the block number.
        const blockNumber = await hre.ethers.provider.getBlockNumber(); //getting the block number.
        console.log(`Current block number: ${blockNumber}`);
    }
);

//This custom task will not show up in the list of hardhat tasks when you run 'yarn hardhat'. We'll have to import it to the 'hardhat.config.js' file:
// require('./tasks/block-number');

module.exports = {}; //exporting

/* 
Now it will be available  in the list of hardhat tasks when you run 'yarn hardhat'.

you can run it like this for harhat network: 
yarn hardhat block-number

yarn run v1.22.19
$ "D:\Work\Solidity Basics\Patrick Collins\6\node_modules\.bin\hardhat" block-number
Current block number: 0
Done in 3.28s.

==> The block number of hardhat network is reset every time we run this script, that is why it is '0'.

For Rinkeby:
yarn hardhat block-number --network rinkeby

yarn run v1.22.19
$ "D:\Work\Solidity Basics\Patrick Collins\6\node_modules\.bin\hardhat" block-number --network rinkeby
Current block number: 11178792
Done in 4.04s.

*/
