const CACHE_NAME = "blume-menu-cache-v6.4";  // Incremented version as suggested
const BASE_PATH = "";
const urlsToCache = [ 
  `./`,
  // HTML Files
  `./index.html`,
  `./menu%20shisha.html`,
  `./rusian%20flavors.html`,
  `./Arabic%20Flavors.html`,
  `./Turkish%20Flavors.html`,
  `./Signature%20Mix%20Flavors.html`,
  `./test%20.html`,
  `./update-vercion.html`,
  `./update-log.json`,

  // JavaScript Filesi
  `./menu.js`,
  `./index.js`,
  `./app.js`,
  `./language-manager.js`,

 // json filesi
  `./ar.json`,
  `./en.json`,
  `./flavors-ar.json`,
  `./flavors-en.json`,

  // CSS Files
  `./input.css`,
  `./src/styles.css`,

  // PWA Files
  `./manifest.json`,
  `./service-worker.js`,

  // Icons
  `./icons/icon-192.png`,
  `./icons/icon-512.png`,

  // Images
  `./imag/blume1%20mix%20image.png`,
  `./imag/blume2%20mix%20image.png`,
  `./imag/blume3%20mix%20image.png`,
  `./imag/blume4%20mix%20image.png`,
  `./imag/blume5%20mix%20image.png`,
  `./imag/hookah%20image.jpg`,
  `./imag/hookah2%20image.jpg`,
  `./imag/blume%20backg5.png`,
  `./imag/smoke%20effect.mp4`,
  `./imag/smoke2%20effect.mp4`,
  `./imag/blume3%20back.png`,
  `./imag/blueberry.jpg`,
  `./imag/melon.jpg`,
  `./imag/peash.avif`,
  `./imag/sweetmelon.jpg`,
  `./imag/cinnamon.webp`,
  `./imag/doubleApple.jpg`,
  `./imag/grape.jpg`,
  `./imag/grapemint.jpg`,
  `./imag/gum.webp`,
  `./imag/gumMint.png`,
  `./imag/lemonmint.jpg`,
  `./imag/mint.jpg`,
  `./imag/orange.jpg`,
  `./imag/watermelon.jpg`,
  `./imag/istanbul%20night%20image.webp`,
  `./imag/lady%20killer%20image.png`,
  `./imag/lime%20space%20peach%20image.png`,
  `./imag/love66%20image.png`,
  `./imag/marbella%20image.png`,
  `./imag/reactor%20image.webp`,
  `./imag/rocket%20image.webp`
];

// ✅ Installation with immediate activation
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Force immediate service worker activation
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('✅ Opening cache');
        for (const url of urlsToCache) {
          try {
            console.log('Caching:', url);
            await cache.add(url);
          } catch (error) {
            console.error('❌ Failed to cache:', url, error);
            // Do not throw error to prevent install failure
          }
        }
      })
      .catch(error => {
        console.error('❌ Error in cache.add:', error);
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
