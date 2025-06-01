const CACHE_NAME = "blume-menu-cache-v6.9.1";
const BASE_PATH = "";
const urlsToCache = [ 
  `./`,
  `./index.html`,
  `./menu shisha.html`,
  `./rusian flavors.html`,
  `./Arabic Flavors.html`,
  `./Turkish Flavors.html`,
  `./Signature Mix Flavors.html`,
  `./update-vercion.html`,
  `./update-log.json`,
  `./menu.js`,
  `./index.js`,
  `./js/app.js`,
  `./js/language-manager.js`,
  `./lang/ar.json`,
  `./lang/en.json`,
  `./lang/flavors-ar.json`,
  `./lang/flavors-en.json`,
  `./input.css`,
  `./src/styles.css`,
  `./manifest.json`,
  `./service-worker.js`,
  `./icons/icon-192.png`,
  `./icons/icon-512.png`,
  `./imag/blueberry.jpg`,
  `./imag/blume backg5.png`,
  `./imag/blume1 mix image.png`,
  `./imag/blume2 mix image.png`,
  `./imag/blume3 back.png`,
  `./imag/blume3 mix image.png`,
  `./imag/blume4 mix image.png`,
  `./imag/blume5 mix image.png`,
  `./imag/Cinnamon.webp`,
  `./imag/doubleApple.jpg`,
  `./imag/grape.jpg`,
  `./imag/grapemint.jpg`,
  `./imag/gum.webp`,
  `./imag/gumMint.png`,
  `./imag/hookah image.jpg`,
  `./imag/hookah2 image.jpg`,
  `./imag/istanbul night image.webp`,
  `./imag/lady killer image.png`,
  `./imag/lemonmint.jpg`,
  `./imag/lime space peach image.png`,
  `./imag/love66 image.png`,
  `./imag/marbella image.png`,
  `./imag/melon.jpg`,
  `./imag/mint.jpg`,
  `./imag/orange.jpg`,
  `./imag/peash.avif`,
  `./imag/reacter image.webp`,
  `./imag/roket image.webp`,
  `./imag/smoke2 effect.mp4`,
  `./imag/sweetmelon.jpg`,
  `./imag/tray.png`,
  `./imag/watermelon.jpg`
];

// Installation with immediate activation
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        for (const url of urlsToCache) {
          try {
            const fullUrl = BASE_PATH + url;
            await cache.add(fullUrl);
          } catch (error) {
            console.error('Failed to cache:', url, error);
          }
        }
      })
  );
});

// Activation with immediate client claim and cache cleanup
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch handling
self.addEventListener("fetch", (event) => {
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          if (!fetchResponse || !fetchResponse.ok) {
            return fetchResponse;
          }
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
      .catch(() => caches.match(`${BASE_PATH}/index.html`))
  );
});
