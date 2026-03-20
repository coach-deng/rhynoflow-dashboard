/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1b2e35',
        'brand-green': '#00c853',
        'brand-dark': '#1a1a1a',
      },
    },
  },
  plugins: [],
}
