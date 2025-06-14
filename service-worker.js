const CACHE_NAME = "blume-menu-cache-v7.1.0";
const BASE_PATH = "";
const urlsToCache = [ 
  `./`,
  `./index.html`,
  `./menu shisha.html`,
  `./russian-flavors.html`,
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
  `./imag/BLUEBERRY.png`,
  `./imag/blume backg5.png`,
  `./imag/blume1 mix image.png`,
  `./imag/blume2 mix image.png`,
  `./imag/blume3 mix image.png`,
  `./imag/blume4 mix image.png`,
  `./imag/blume5 mix image.png`,
  `./imag/Cinnamon.png`,
  `./imag/doubleApple.png`,
  `./imag/grape.png`,
  `./imag/gumMint.png`,
  `./imag/hookah image.jpg`,
  `./imag/hookah2 image.jpg`,
  `./imag/istanbulnight.jpg`,
  `./imag/ladykiller.jpg`,
  `./imag/lime space peach.jpg`,
  `./imag/limon-mint.png`,
  `./imag/love66.webp`,
  `./imag/marbella.jpg`,
  `./imag/MELON.png`,
  `./imag/MINT.png`,
  `./imag/ORANGE.png`,
  `./imag/PEACH.png`,
  `./imag/reacter image.webp`,
  `./imag/roket image.webp`,
  `./imag/watermelon.png`,
  `./imagrs/Banana.jpg`,
  `./imagrs/Blueberry Crumble.jpg`,
  `./imagrs/Belgium Waffles.jpg`,
  `./imagrs/Strawberry Millefeuille.jpg`,
  `./imagrs/Pinacolada.jpg`,
  `./imagrs/Raspberry.webp`,
  `./imagrs/Coconut.jpg`,
  `./imagrs/Cola.webp`,
  `./imagrs/Cream-Soda.webp`,
  `./imagrs/Epic-Yogurt.jpg`,
  `./imagrs/Estragon.jpg`,
  `./imagrs/Falling-Star.webp`,
  `./imagrs/Garnet-grape.jpg`,
  `./imagrs/grapefruit.jpg`,
  `./imagrs/Ice-crame.webp`,
  `./imagrs/Kiwi-Smoothie.jpg`,
  `./imagrs/lee-punch.webp`,
  `./imagrs/Lemon-Blast.jpg`,
  `./imagrs/Melonade.jpg`,
  `./imagrs/Needles.jpg`,
  `./imagrs/PineApple-Rings.jpg`,
  `./imagrs/Pinkman.jpg`,
  `./imagrs/Rocketman.webp`,
  `./imagrs/Supernova.jpg`,
  `./imagrs/Unicorn.jpg`,
  `./imagrs/Vanilla.jpg`,
  `./imagrs/VIVA-La-Fiesta.jpg`,
  `./imagrs/watermelon-punch.jpg`,
  `./imag/watertk.jpg`
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
