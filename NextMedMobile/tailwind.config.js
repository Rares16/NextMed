// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"], // Adjust paths as needed
    presets: [require("nativewind/preset")], // Ensure this is correct
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#14967f', // main green
            dark: '#095d7e',    // dark blue for text
            light: '#e2fcd6',   // light green background
          },
          secondary: {
            DEFAULT: '#ccecee', // light blue for input fields
          },
          background: {
            light: '#f1f9ff',   // very light blue background
            medium: '#ccecee',  // light blue background for input fields
          },
        },
        fontFamily: {
          sans: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        },
        boxShadow: {
          'card': '0 4px 6px rgba(0, 0, 0, 0.1)', // shadow for buttons and cards
        },
      },
    },
    plugins: [],
  };