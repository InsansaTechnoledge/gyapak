import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import history from 'connect-history-api-fallback';  // ✅ IMPORT THIS

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 5173,
    },
    middlewareMode: false, // ✅ Keep it false
    // ✅ Add configureServer
    configureServer(server) {
      server.middlewares.use(
        history({
          verbose: true, // (optional) logs fallback actions
          disableDotRule: true, // allows paths like /test.page
          htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
        })
      );
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
