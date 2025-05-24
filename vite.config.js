import { defineConfig } from 'vite';
import { resolve } from 'path';
import legacy from '@vitejs/plugin-legacy';
import { createHtmlPlugin } from 'vite-plugin-html';

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
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // Ensure proper handling of static assets
    copyPublicDir: true,
    assetsInlineLimit: 0
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
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Artisan Home Furnitures'
        }
      },
      template: 'index.html',
      pages: [
        {
          filename: 'collections/sofas.html',
          template: 'collections/sofas.html',
          injectOptions: {
            data: {
              title: 'Sofas Collection - Artisan Home Furnitures'
            }
          }
        },
        {
          filename: 'collections/dining.html',
          template: 'collections/dining.html',
          injectOptions: {
            data: {
              title: 'Dining Collection - Artisan Home Furnitures'
            }
          }
        },
        {
          filename: 'collections/bedroom.html',
          template: 'collections/bedroom.html',
          injectOptions: {
            data: {
              title: 'Bedroom Collection - Artisan Home Furnitures'
            }
          }
        },
        {
          filename: 'collections/living.html',
          template: 'collections/living.html',
          injectOptions: {
            data: {
              title: 'Living Room Collection - Artisan Home Furnitures'
            }
          }
        },
        {
          filename: 'collections/storage.html',
          template: 'collections/storage.html',
          injectOptions: {
            data: {
              title: 'Storage Collection - Artisan Home Furnitures'
            }
          }
        },
        {
          filename: 'collections/office.html',
          template: 'collections/office.html',
          injectOptions: {
            data: {
              title: 'Office Collection - Artisan Home Furnitures'
            }
          }
        },
        {
          filename: 'collections/outdoor.html',
          template: 'collections/outdoor.html',
          injectOptions: {
            data: {
              title: 'Outdoor Collection - Artisan Home Furnitures'
            }
          }
        }
      ]
    })
  ],
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