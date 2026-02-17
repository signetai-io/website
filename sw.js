const CACHE_NAME = 'signet-v0.4.4-assets';
// Use absolute paths assuming the SW is served from scope root
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  '/192.png',
  '/512.png'
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
        console.error('Signet PWA: Critical Cache Failed', err);
      })
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((response) => {
        return response || fetch(request).catch(() => {
             return caches.match('./index.html');
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(request);
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