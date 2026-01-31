/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: '#FAF6F1', // Soft cream background
        panel: '#FFFFFF',
        ink: '#1A1D21',
        cyberAmber: '#F4D371', // Migration Health yellow
        cyberRose: '#F8B4C9',  // Agent Impact pink
        cyberAzure: '#C4D9F2', // Resolution Rate blue
      },
      borderRadius: {
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}