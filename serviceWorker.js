const CACHE_NAME = 'inktalk-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/login.js',
  '/manifest.json',
  '/inktalk-mascote.png',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
// Esse é o service worker do InkTalk, que gerencia o cache dos recursos do aplicativo para permitir o funcionamento offline e melhorar a performance.