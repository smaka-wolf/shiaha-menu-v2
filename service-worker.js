const CACHE_NAME = "blume-nemu-cache-v1";
const urlsToCache = [
  ".",
  // HTML Files
  "index.html",
  "menu shisha.html",
  "rusian flavors.html",
  "Arabic Flavors.html",
  "Turkish Flavors.html",
  "Signature Mix Flavors.html",
  "test .html",
  "update,",

  // JavaScript Files
  "menu.js",

  // PWA Files
  "manifest.json",
  "service-worker.js",

  // Icons
  "icons/icon-192.png",
  "icons/icon-512.png",

  // Images
  "imag/blume1 mix image.png",
  "imag/blume2 mix image.png",
  "imag/blume3 mix image.png",
  "imag/blume4 mix image.png",
  "imag/blume5 mix image.png",
  "imag/hookah image.jpg",
  "imag/hookah2 image.jpg",
  "imag/image menu blume.png",
  "imag/image menu blume3.png",
  "imag/istanbul night image.webp",
  "imag/lady killer image.png",
  "imag/lime space peach image.png",
  "imag/love66 image.png",
  "imag/marbella image.png",
  "imag/reacter image.webp",
  "imag/roket image.webp"
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
            return caches.match('index.html');
          });
      })
  );
});
