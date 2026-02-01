// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This tells Vite: "Any request starting with /api, send it to the backend"
      '/api': {
        target: 'http://127.0.0.1:3000', 
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

