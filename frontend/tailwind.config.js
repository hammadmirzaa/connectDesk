// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this includes your components
  ],
  theme: {
    extend: {
      colors: {
        mainBackgroundColor: "#36454F", 
        columnBackgroundColor: "#141414", 
      },
       fontFamily: {
        sans: ['Poppins', 'sans-serif'], 
      },
    },
  },
  plugins: [],
}
