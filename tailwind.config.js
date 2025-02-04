/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        title:["Audiowide", "sans-serif"],
        chakra:["Chakra Petch", "sans-serif" ]
      }
    },
  },
  plugins: [],
}