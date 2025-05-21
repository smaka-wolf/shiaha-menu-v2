const CACHE_NAME = "blume-menu-cache-v3";  // Incremented version for path handling fixes
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

  // JavaScript Files
  `${BASE_PATH}/menu.js`,

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
  `${BASE_PATH}/imag/blume55.png`,
  `${BASE_PATH}/imag/istanbul night image.webp`,
  `${BASE_PATH}/imag/lady killer image.png`,
  `${BASE_PATH}/imag/lime space peach image.png`,
  `${BASE_PATH}/imag/love66 image.png`,
  `${BASE_PATH}/imag/marbella image.png`,
  `${BASE_PATH}/imag/reacter image.webp`,
  `${BASE_PATH}/imag/roket image.webp`
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

  // Extract the path and ensure proper BASE_PATH handling
  const requestURL = new URL(event.request.url);
  const path = requestURL.pathname.replace(/^\//, '');
  const basePath = BASE_PATH.replace(/^\//, '');
  const cachePath = path.startsWith(basePath) ? path : `${basePath}/${path}`;

  event.respondWith(
    caches.match('/' + cachePath)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Create new request with correct path
        const fetchRequest = new Request('/' + cachePath);

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
                cache.put('/' + cachePath, responseToCache);
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
