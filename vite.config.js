// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  resolve: {
    alias: {
      // Adjust alias to point to a specific folder
      '@': path.resolve(__dirname, './'),
    }
  },
  server: {
    https: {
      key: fs.readFileSync('../localhost+2-key.pem'),
      cert: fs.readFileSync('../localhost+2.pem')
    }
  }
});
