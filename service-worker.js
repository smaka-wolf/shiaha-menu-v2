const CACHE_NAME = "blume-menu-cache-v6.9.4";
const BASE_PATH = "/shiaha-menu-v2";
const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/menu shisha.html`,
  `${BASE_PATH}/russian-flavors.html`,
  `${BASE_PATH}/Arabic Flavors.html`,
  `${BASE_PATH}/Turkish Flavors.html`,
  `${BASE_PATH}/Signature Mix Flavors.html`,
  `${BASE_PATH}/update-vercion.html`,
  `${BASE_PATH}/update-log.json`,
  `${BASE_PATH}/menu.js`,
  `${BASE_PATH}/index.js`,
  `${BASE_PATH}/js/app.js`,
  `${BASE_PATH}/js/language-manager.js`,
  `${BASE_PATH}/lang/ar.json`,
  `${BASE_PATH}/lang/en.json`,
  `${BASE_PATH}/lang/flavors-ar.json`,
  `${BASE_PATH}/lang/flavors-en.json`,
  `${BASE_PATH}/input.css`,
  `${BASE_PATH}/src/styles.css`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/service-worker.js`,
  `${BASE_PATH}/icons/icon-192.png`,
  `${BASE_PATH}/icons/icon-512.png`,
  `${BASE_PATH}/imag/blueberry.jpg`,
  `${BASE_PATH}/imag/blume backg5.png`,
  `${BASE_PATH}/imag/blume1 mix image.png`,
  `${BASE_PATH}/imag/blume2 mix image.png`,
  `${BASE_PATH}/imag/blume3 back.png`,
  `${BASE_PATH}/imag/blume3 mix image.png`,
  `${BASE_PATH}/imag/blume4 mix image.png`,
  `${BASE_PATH}/imag/blume5 mix image.png`,
  `${BASE_PATH}/imag/Cinnamon.webp`,
  `${BASE_PATH}/imag/doubleApple.jpg`,
  `${BASE_PATH}/imag/grape.jpg`,
  `${BASE_PATH}/imag/grapemint.jpg`,
  `${BASE_PATH}/imag/gum.webp`,
  `${BASE_PATH}/imag/gumMint.png`,
  `${BASE_PATH}/imag/hookah image.jpg`,
  `${BASE_PATH}/imag/hookah2 image.jpg`,
  `${BASE_PATH}/imag/istanbul night image.webp`,
  `${BASE_PATH}/imag/lady killer image.png`,
  `${BASE_PATH}/imag/lemonmint.jpg`,
  `${BASE_PATH}/imag/lime space peach image.png`,
  `${BASE_PATH}/imag/love66 image.png`,
  `${BASE_PATH}/imag/marbella image.png`,
  `${BASE_PATH}/imag/melon.jpg`,
  `${BASE_PATH}/imag/mint.jpg`,
  `${BASE_PATH}/imag/orange.jpg`,
  `${BASE_PATH}/imag/peash.avif`,
  `${BASE_PATH}/imag/reacter image.webp`,
  `${BASE_PATH}/imag/roket image.webp`,
  `${BASE_PATH}/imag/smoke2 effect.mp4`,
  `${BASE_PATH}/imag/sweetmelon.jpg`,
  `${BASE_PATH}/imag/tray.png`,
  `${BASE_PATH}/imag/watermelon.jpg`
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
