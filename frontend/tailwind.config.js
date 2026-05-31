/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f5e9', 100: '#c8e6c9', 200: '#a5d6a7', 300: '#81c784',
          400: '#66bb6a', 500: '#4caf50', 600: '#43a047', 700: '#386518',
          800: '#2e5c14', 900: '#1b3a0a', DEFAULT: '#386518',
        },
        secondary: { DEFAULT: '#EDBF5D', light: '#f5d48a', dark: '#d4a52e' },
        neutral: {
          100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#AFAFAF',
          500: '#8a8a8a', 600: '#6b6b6b', 700: '#4a4a4a', 800: '#2e2e2e', 900: '#1a1a1a',
        },
        success: '#4caf50', warning: '#ff9800', error: '#f44336', info: '#2196f3',
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
}