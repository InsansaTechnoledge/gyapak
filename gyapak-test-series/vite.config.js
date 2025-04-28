import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import history from 'connect-history-api-fallback'
import { createServer } from 'vite'
 
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    historyApiFallback: true,
  },
  configureServer: (server) => {
    server.middlewares.use(history())
  }
})