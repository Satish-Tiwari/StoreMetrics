import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Output compiled static assets to dist/ (which Maven resources plugin copies)
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core dependencies
          vendor: ['react', 'react-dom'],
          // Form and validation libraries
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Data fetching and UI charts
          data: ['@tanstack/react-query', 'axios', 'recharts'],
          // UI Icons
          icons: ['lucide-react']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
  server: {
    port: 5173,
    // In development, proxy all /api requests to the Spring Boot backend
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
});
