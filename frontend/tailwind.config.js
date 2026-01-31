/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: '#F9FAFB', // Soft light gray
        panel: '#FFFFFF',
        ink: '#111827', // Deep charcoal
        muted: '#6B7280',
        accent: '#141414',
      },
    },
  },
  plugins: [],
}