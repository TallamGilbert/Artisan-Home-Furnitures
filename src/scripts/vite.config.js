import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        collections: resolve(__dirname, 'src/pages/collections/index.html'),
        cart: resolve(__dirname, 'src/pages/cart/index.html'),
        checkout: resolve(__dirname, 'src/pages/checkout/index.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  plugins: []
}); 