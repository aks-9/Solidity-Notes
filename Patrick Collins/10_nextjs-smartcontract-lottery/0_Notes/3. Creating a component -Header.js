//* Creating a component -Header

// create a new folder 'components' in the root of the project, then create a new file in it 'Header.js'

// This is 'Header.js' file.

//* A component is similar to a JavaScript function, but work in isolation and return HTML.

// So basically we will create a chunk of HTML that we're gonna export into our 'index.js'. This help us modularize and reuse a component like this 'Header' across the project.

// This is going to be a function based component. It will be a function just like in JS, but it's going to return HTML. To resue this component, we'll export it by using 'export default' before the 'function' keyword.

// function based component.
export default function Header() {
  return <div>Hi from the Header!</div>; //returns HTML
}

// Now we can import it in our 'index.js' file.
