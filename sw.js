const CACHE_NAME = 'game-cache-v1';
const CACHE_DURATION = 90 * 24 * 60 * 60 * 1000; // 3 ay
const FILE_TO_CACHE = 'https://cdn.jsdelivr.net/gh/cach-ehm/sw@main/gran.xml';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add(FILE_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url === FILE_TO_CACHE) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          const cacheTime = response.headers.get('date');
          if (cacheTime && (Date.now() - new Date(cacheTime).getTime()) < CACHE_DURATION) {
            return response;
          }
        }
        return fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});