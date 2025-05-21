const CACHE_NAME = "blume-menu-cache-v1";
const BASE_PATH = "https://smaka-wolf.github.io/shiaha-menu-v2";
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

  // JavaScript Files
  `${BASE_PATH}/menu.js`,

  // CSS Files
  `${BASE_PATH}/src/styles.css`,
  `${BASE_PATH}/input.css`,

  // Configuration Files
  `${BASE_PATH}/tailwind.config.js`,
  `${BASE_PATH}/package.json`,

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
  `${BASE_PATH}/imag/image menu blume.png`,
  `${BASE_PATH}/imag/image menu blume3.png`,
  `${BASE_PATH}/imag/istanbul night image.webp`,
  `${BASE_PATH}/imag/lady killer image.png`,
  `${BASE_PATH}/imag/lime space peach image.png`,
  `${BASE_PATH}/imag/love66 image.png`,
  `${BASE_PATH}/imag/marbella image.png`,
  `${BASE_PATH}/imag/reacter image.webp`,
  `${BASE_PATH}/imag/roket image.webp`,
  `${BASE_PATH}/imag/blume55.png`
];

// ✅ تنصيب الكاش أول مرة
self.addEventListener("install", (event) => {
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

// ✅ تفعيل الخدمة وتحديث الكاش إذا تغيّر
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// ✅ استرجاع البيانات من الكاش أو الشبكة
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If both cache and network fail, return offline page
            return caches.match(`${BASE_PATH}/index.html`);
          });
      })
  );
});
