//Using async function in a script.
async function main() {
    console.log('hi');
    let variable = 5;
    console.log(variable);
}

//as we're using async function, we have to use '.then()' and '.catch()' after the main function call.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
