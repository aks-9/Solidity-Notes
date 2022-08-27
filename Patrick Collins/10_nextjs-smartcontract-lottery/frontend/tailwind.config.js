//* 34. Tailwind and Styling- 1

// For making our frontend look good.

// https://tailwindcss.com/docs/guides/nextjs

//* Installation
// open a new terminal, 'cd' into your frontend, and run:
// yarn add --dev tailwindcss postcss autoprefixer

//* Initialization
// yarn tailwindcss init -p
// This will create two files in the rooto of our project: 'tailwind.config.js' and 'postcss.config.js'

//* This is 'tailwind.config.js' file.

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
