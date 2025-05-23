import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sofas: resolve(__dirname, 'collections/sofas.html'),
        dining: resolve(__dirname, 'collections/dining.html'),
        bedroom: resolve(__dirname, 'collections/bedroom.html'),
        living: resolve(__dirname, 'collections/living.html'),
        storage: resolve(__dirname, 'collections/storage.html'),
        office: resolve(__dirname, 'collections/office.html'),
        outdoor: resolve(__dirname, 'collections/outdoor.html')
      }
    }
  },
  publicDir: 'public',
  server: {
    port: 3000
  }
}); 