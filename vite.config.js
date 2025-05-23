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
      },
      external: [
        // External dependencies
        'bootstrap',
        'font-awesome'
      ],
      output: {
        // Ensure JavaScript files are properly handled
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  publicDir: 'public',
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@js': resolve(__dirname, './js'),
      '@components': resolve(__dirname, './components'),
      '@images': resolve(__dirname, './images')
    }
  },
  optimizeDeps: {
    include: [
      'js/script.js',
      'js/theme.js',
      'js/cart.js',
      'js/quick-view.js',
      'js/user-menu.js',
      'js/navbar.js',
      'js/loadComponents.js'
    ]
  }
}); 