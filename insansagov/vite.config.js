// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import compression from 'vite-plugin-compression';

// export default defineConfig({
//   plugins: [
//     react(),
//     compression({
//       brotli: true,
//       gzip: true,
//     }),
//   ],
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression({
      brotli: true,
      gzip: true,
    }),
  ],
  build: {
    // Control chunk splitting
    chunkSizeWarningLimit: 500, // Reduce the chunk size warning limit (in KB)

    // Rollup options to control chunking
    rollupOptions: {
      output: {
        // Disable automatic chunk splitting
        manualChunks: {
          'pdf.worker': ['pdfjs-dist/build/pdf.worker.min'],
        }, // This disables code-splitting
        // You can manually specify chunk sizes for particular libraries
        // Example:
        // chunkFileNames: '[name]-[hash].js',
      },
    },
    
    // Optionally, you can set 'target' to 'esnext' to avoid polyfilling
    target: 'esnext', // Use native JavaScript features for modern browsers
  },
});
