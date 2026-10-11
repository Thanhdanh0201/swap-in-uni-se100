import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'

// Proxy /api sang backend (cổng 5180) để cùng origin, khỏi cấu hình CORS khi dev.
export default defineConfig({
  // Vitest không cần plugin React Router (plugin này đòi file routes).
  plugins: [!process.env.VITEST && reactRouter()],
  server: {
    port: 5174,
    proxy: { '/api': 'http://localhost:5180' },
  },
})
