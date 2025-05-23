const CACHE_NAME = "blume-menu-cache-v5.6";  // Incremented version as suggested
const BASE_PATH = "/shiaha-menu-v2";
const urlsToCache = [ 
  `${BASE_PATH}/`,
  // HTML Files
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/menu%20shisha.html`,
  `${BASE_PATH}/rusian%20flavors.html`,
  `${BASE_PATH}/Arabic%20Flavors.html`,
  `${BASE_PATH}/Turkish%20Flavors.html`,
  `${BASE_PATH}/Signature%20Mix%20Flavors.html`,
  `${BASE_PATH}/test%20.html`,

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

  // CSS Files
  `${BASE_PATH}/input.css`,
  `${BASE_PATH}/src/styles.css`,

  // PWA Files
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/service-worker.js`,

  // Icons
  `${BASE_PATH}/icons/icon-192.png`,
  `${BASE_PATH}/icons/icon-512.png`,

  // Images
  `${BASE_PATH}/imag/blume1%20mix%20image.png`,
  `${BASE_PATH}/imag/blume2%20mix%20image.png`,
  `${BASE_PATH}/imag/blume3%20mix%20image.png`,
  `${BASE_PATH}/imag/blume4%20mix%20image.png`,
  `${BASE_PATH}/imag/blume5%20mix%20image.png`,
  `${BASE_PATH}/imag/hookah%20image.jpg`,
  `${BASE_PATH}/imag/hookah2%20image.jpg`,
  `${BASE_PATH}/imag/blume%20backg5.png`,
  `${BASE_PATH}/imag/smoke%20effect.mp4`,
  `${BASE_PATH}/imag/smoke2%20effect.mp4`,
  `${BASE_PATH}/imag/blume3%20back.png`,
  `${BASE_PATH}/imag/blueberry.jpg`,
  `${BASE_PATH}/imag/melon.jpg`,
  `${BASE_PATH}/imag/peash.avif`,
  `${BASE_PATH}/imag/sweetmelon.jpg`,
  `${BASE_PATH}/imag/cinnamon.webp`,
  `${BASE_PATH}/imag/doubleApple.jpg`,
  `${BASE_PATH}/imag/grape.jpg`,
  `${BASE_PATH}/imag/grapemint.jpg`,
  `${BASE_PATH}/imag/gum.webp`,
  `${BASE_PATH}/imag/gumMint.png`,
  `${BASE_PATH}/imag/lemonmint.jpg`,
  `${BASE_PATH}/imag/mint.jpg`,
  `${BASE_PATH}/imag/orange.jpg`,
  `${BASE_PATH}/imag/watermelon.jpg`,
  `${BASE_PATH}/imag/istanbul%20night%20image.webp`,
  `${BASE_PATH}/imag/lady%20killer%20image.png`,
  `${BASE_PATH}/imag/lime%20space%20peach%20image.png`,
  `${BASE_PATH}/imag/love66%20image.png`,
  `${BASE_PATH}/imag/marbella%20image.png`,
  `${BASE_PATH}/imag/reactor%20image.webp`,
  `${BASE_PATH}/imag/rocket%20image.webp`
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
