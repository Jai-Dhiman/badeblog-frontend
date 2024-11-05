/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        base: "1.125rem",
      },
      spacing: {
        safe: "2rem",
      },
    },
  },
  plugins: [],
};
