/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#e1e9f2',
          200: '#c5d5e5',
          300: '#99b8d2',
          400: '#6795bc',
          500: '#4378a5',
          600: '#325f88',
          700: '#294d6f',
          800: '#1b344d',
          900: '#0f2134',
          950: '#0a1624',
        }
      }
    },
  },
  plugins: [],
}
