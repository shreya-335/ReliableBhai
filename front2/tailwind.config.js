/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Add paths for the specific structure of front2
    "./App.jsx",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Matches the 'cyber' theme variables used in your CSS
        cyber: {
          amber: '#fef3c7',
          rose: '#fce7f3',
          azure: '#dbeafe',
        },
      },
      borderRadius: {
        // Essential for the 'sim-card' look
        '32px': '32px',
      },
      fontFamily: {
        // Ensure you use a bold, tracking-tight sans font for that 'Bhai' look
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}