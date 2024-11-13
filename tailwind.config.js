/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // We can add custom colors, fonts, etc. here
      colors: {
        primary: '#1a365d', // dark blue
        secondary: '#2c5282', // medium blue
        accent: '#4299e1', // light blue
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [import('@tailwindcss/typography')],
}
