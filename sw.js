const CACHE_NAME = 'alkitab-pwa-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'style.css',
  'script.js',
  'manifest.json'
];

// Install Service Worker dan simpan struktur web ke memori HP (Cache)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Aktivasi dan hapus cache lama jika ada update kode
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Strategi: Ambil dari internet dulu untuk data ayat terbaru, 
// jika offline, tampilkan halaman web yang sudah tersimpan di cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
