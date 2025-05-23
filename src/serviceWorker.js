const CACHE_NAME = 'artisan-home-v1';
const urlsToCache = [
  '/',
  '/src/pages/index.html',
  '/src/styles/styles.css',
  '/src/scripts/theme.js',
  '/src/scripts/cart.js',
  '/src/scripts/quick-view.js',
  '/src/scripts/script.js',
  '/src/assets/images/hero-bg.webp',
  '/src/assets/images/products/Luxe Sofa.jpg',
  '/src/assets/images/products/Artisan Dining Table.jpg',
  '/src/assets/images/products/Modern Lounge Chair.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 