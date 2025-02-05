const CACHE_NAME = 'quantum-dialog-v1';

const STATIC_ASSETS = [
  '/',
  '/index.fr.html',
  '/index.en.html',
  '/manifest.json',
  '/src/styles/main.css',
  '/src/styles/variables.css',
  '/src/styles/reset.css',
  '/src/styles/components/messages.css',
  '/src/styles/utils/animations.css',
  '/src/scripts/dialog-loader.js',
  '/src/assets/icons/favicon.svg',
  'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap'
];

// Installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Activation et nettoyage
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Stratégie de cache : Network First avec fallback sur le cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mise en cache de la nouvelle réponse
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
