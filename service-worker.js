const CACHE_NAME = "blume-menu-cache-v6.4";  // Incremented version as suggested
const BASE_PATH = "/shiaha-menu-v2";
const urlsToCache = [ 
  `/shiaha-menu-v2/`,
  // HTML Files
  `/shiaha-menu-v2/index.html`,
  `/shiaha-menu-v2/menu%20shisha.html`,
  `/shiaha-menu-v2/rusian%20flavors.html`,
  `/shiaha-menu-v2/Arabic%20Flavors.html`,
  `/shiaha-menu-v2/Turkish%20Flavors.html`,
  `/shiaha-menu-v2/Signature%20Mix%20Flavors.html`,
  `/shiaha-menu-v2/test%20.html`,
  `/shiaha-menu-v2/update-vercion.html`,
  `/shiaha-menu-v2/update-log.json`,

  // JavaScript Filesi
  `/shiaha-menu-v2/menu.js`,
  `/shiaha-menu-v2/index.js`,
  `/shiaha-menu-v2/app.js`,
  `/shiaha-menu-v2/language-manager.js`,

 // json filesi
  `/shiaha-menu-v2/ar.json`,
  `/shiaha-menu-v2/en.json`,
  `/shiaha-menu-v2/flavors-ar.json`,
  `/shiaha-menu-v2/flavors-en.json`,

  // CSS Files
  `/shiaha-menu-v2/input.css`,
  `/shiaha-menu-v2/src/styles.css`,

  // PWA Files
  `/shiaha-menu-v2/manifest.json`,
  `/shiaha-menu-v2/service-worker.js`,

  // Icons
  `/shiaha-menu-v2/icons/icon-192.png`,
  `/shiaha-menu-v2/icons/icon-512.png`,

  // Images
  `/shiaha-menu-v2/imag/blume1%20mix%20image.png`,
  `/shiaha-menu-v2/imag/blume2%20mix%20image.png`,
  `/shiaha-menu-v2/imag/blume3%20mix%20image.png`,
  `/shiaha-menu-v2/imag/blume4%20mix%20image.png`,
  `/shiaha-menu-v2/imag/blume5%20mix%20image.png`,
  `/shiaha-menu-v2/imag/hookah%20image.jpg`,
  `/shiaha-menu-v2/imag/hookah2%20image.jpg`,
  `/shiaha-menu-v2/imag/blume%20backg5.png`,
  `/shiaha-menu-v2/imag/smoke%20effect.mp4`,
  `/shiaha-menu-v2/imag/smoke2%20effect.mp4`,
  `/shiaha-menu-v2/imag/blume3%20back.png`,
  `/shiaha-menu-v2/imag/blueberry.jpg`,
  `/shiaha-menu-v2/imag/melon.jpg`,
  `/shiaha-menu-v2/imag/peash.avif`,
  `/shiaha-menu-v2/imag/sweetmelon.jpg`,
  `/shiaha-menu-v2/imag/cinnamon.webp`,
  `/shiaha-menu-v2/imag/doubleApple.jpg`,
  `/shiaha-menu-v2/imag/grape.jpg`,
  `/shiaha-menu-v2/imag/grapemint.jpg`,
  `/shiaha-menu-v2/imag/gum.webp`,
  `/shiaha-menu-v2/imag/gumMint.png`,
  `/shiaha-menu-v2/imag/lemonmint.jpg`,
  `/shiaha-menu-v2/imag/mint.jpg`,
  `/shiaha-menu-v2/imag/orange.jpg`,
  `/shiaha-menu-v2/imag/watermelon.jpg`,
  `/shiaha-menu-v2/imag/istanbul%20night%20image.webp`,
  `/shiaha-menu-v2/imag/lady%20killer%20image.png`,
  `/shiaha-menu-v2/imag/lime%20space%20peach%20image.png`,
  `/shiaha-menu-v2/imag/love66%20image.png`,
  `/shiaha-menu-v2/imag/marbella%20image.png`,
  `/shiaha-menu-v2/imag/reactor%20image.webp`,
  `/shiaha-menu-v2/imag/rocket%20image.webp`
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
