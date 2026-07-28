import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // Frontend calls /api/..., backend serves /task-lists/... without /api
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})

