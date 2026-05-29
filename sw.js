const CACHE_NAME = 'alkitab-pwa-v1';
const ASSETS = [
    './',
    './index.html',
    './app.js',
    './manifest.json',
    'https://tailwindcss.com'
];

// Pasang Cache untuk File Statis
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Strategi Cache: Coba Network dulu, kalau offline ambil dari Cache
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request)
            .then((res) => {
                const resClone = res.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    // Simpan hasil fetch API ke cache agar bisa dibaca offline nanti
                    if (e.request.url.includes('alkitab-api')) {
                        cache.put(e.request, resClone);
                    }
                });
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});
