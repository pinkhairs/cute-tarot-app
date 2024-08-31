import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',  // Set the root directory to src
  build: {
    outDir: '../dist',  // Output directory for production build
  },
  server: {
    historyApiFallback: true,
  },
});