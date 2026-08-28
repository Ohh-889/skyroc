import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist/client'
  },
  optimizeDeps: {
    include: ['react', 'react-dom/client']
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['terminal.local'],
    warmup: {
      clientFiles: ['./src/main.jsx']
    }
  },
  plugins: [react()]
});
