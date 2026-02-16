const CACHE_NAME = 'signet-v0.2.9-stable';
// CRITICAL: Only cache files that actually exist in the build output.
// Removing 'index.tsx' as it is a source file, not a served asset.
// If cache.addAll hits a 404, the entire PWA install criteria fails.
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Signet PWA: Caching critical assets');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch((err) => {
        console.error('Signet PWA: Cache failed', err);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Optional: Return a custom offline page here if needed
          // For now, returning undefined lets the browser handle the offline error naturally
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});