const CACHE_NAME = "blume-menu-cache-v5.5";  // Incremented version as suggested
const BASE_PATH = "/shiaha-menu-v2";
const urlsToCache = [ 
  `${BASE_PATH}/`,
  // HTML Files
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/menu shisha.html`,
  `${BASE_PATH}/rusian flavors.html`,
  `${BASE_PATH}/Arabic Flavors.html`,
  `${BASE_PATH}/Turkish Flavors.html`,
  `${BASE_PATH}/Signature Mix Flavors.html`,
  `${BASE_PATH}/test .html`,

  // JavaScript Filesi
  `${BASE_PATH}/menu.js`,
  `${BASE_PATH}/index.js`,
  `${BASE_PATH}/app.js`,
  `${BASE_PATH}/language-manager.js`,

 // json filesi
  `${BASE_PATH}/ar.json`,
  `${BASE_PATH}/en.json`,
  `${BASE_PATH}/flavors-ar.json`,
  `${BASE_PATH}/flavors-en.json`,


  // PWA Files
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/service-worker.js`,

  // Icons
  `${BASE_PATH}/icons/icon-192.png`,
  `${BASE_PATH}/icons/icon-512.png`,

  // Images
  `${BASE_PATH}/imag/blume1 mix image.png`,
  `${BASE_PATH}/imag/blume2 mix image.png`,
  `${BASE_PATH}/imag/blume3 mix image.png`,
  `${BASE_PATH}/imag/blume4 mix image.png`,
  `${BASE_PATH}/imag/blume5 mix image.png`,
  `${BASE_PATH}/imag/hookah image.jpg`,
  `${BASE_PATH}/imag/hookah2 image.jpg`,
  `${BASE_PATH}/imag/blume backg5.png`,
  `${BASE_PATH}/imag/smoke effect.mp4`,
  `${BASE_PATH}/imag/smoke2 effect.mp4`,
  `${BASE_PATH}/imag/blume3 back.png`,
  `${BASE_PATH}/imag/blueberry.jpg`,
  `${BASE_PATH}/imag/melon.jpg`,
  `${BASE_PATH}/imag/peash.avif`,
  `${BASE_PATH}/imag/sweetmelon.jpg`,
  `${BASE_PATH}/imag/cinnamongum.webp`,
  `${BASE_PATH}/imag/doubelAppel.jpg`,
  `${BASE_PATH}/imag/grape.jpg`,
  `${BASE_PATH}/imag/grapemint.jpg`,
  `${BASE_PATH}/imag/gum.webp`,
  `${BASE_PATH}/imag/gumMint.png`,
  `${BASE_PATH}/imag/lemonmint.jpg`,
  `${BASE_PATH}/imag/mint.jpg`,
  `${BASE_PATH}/imag/orange.jpg`,
  `${BASE_PATH}/imag/watermelon.jpg`,
  `${BASE_PATH}/imag/istanbul night image.webp`,
  `${BASE_PATH}/imag/lady killer image.png`,
  `${BASE_PATH}/imag/lime space peach image.png`,
  `${BASE_PATH}/imag/love66 image.png`,
  `${BASE_PATH}/imag/marbella image.png`,
  `${BASE_PATH}/imag/reacter image.webp`,
  `${BASE_PATH}/imag/roket image.webp`
];

// ✅ Installation with immediate activation
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Force immediate service worker activation
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Opening cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('❌ Error in cache.addAll:', error);
        return Promise.reject(error);
      })
  );
});

// ✅ Activation with immediate client claim and cache cleanup
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Force clients to use this service worker
      self.clients.claim()
    ])
  );
});

// ✅ Simplified fetch handling
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
      .catch(() => caches.match(`${BASE_PATH}/index.html`))
  );
});
