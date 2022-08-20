/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        login: "url('/login-background.jpg')",
      },
      fontFamily: {
        sans: ["Source Sans Pro", "sans-serif", "Noto Sans TC", "sans-serif"],
        serif: ["Playfair Display", "serif", "Noto Serif TC", "serif"],
        logo: ["Lobster", "cursive"],
        caption: ["Raleway", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
};
