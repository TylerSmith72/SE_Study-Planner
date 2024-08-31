/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
   "./index.html",
   "./src/**/*.{js,jsx}", 
  ],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#3B71CA",
        secondary: "#9FA6B2",
        info: "#54B4D3",
        light: "#F9FAFB",
        dark: "#1F2937",
        black: "#222222",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [
  ],
};