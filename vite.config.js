// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/app/',
  resolve: {
    alias: {
      // Adjust alias to point to a specific folder
      '@': path.resolve(__dirname, './'),
    }
  },
  build: {
    outDir: path.resolve(__dirname, '../../Local Sites/cute-tarot/app/public/app'),
  }
});
