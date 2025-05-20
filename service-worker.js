const CACHE_NAME = "blume-nemu-cache-v1";
const urlsToCache = [
  "./",
  // HTML Files
  "./index.html",
  "./menu shisha.html",
  "./rusian flavors.html",
  "./Arabic Flavors.html",
  "./Turkish Flavors.html",
  "./Signature Mix Flavors.html",
  "./test .html",
  "./update,html",

  // JavaScript Files
  "./menu.js",

  // PWA Files
  "./manifest.json",
  "./service-worker.js",

  // Icons
  "./icons/icon-192.png",
  "./icons/icon-512.png",

  // Images
  "./imag/blume1 mix image.png",
  "./imag/blume2 mix image.png",
  "./imag/blume3 mix image.png",
  "./imag/blume4 mix image.png",
  "./imag/blume5 mix image.png",
  "./imag/hookah image.jpg",
  "./imag/hookah2 image.jpg",
  "./imag/image menu blume.png",
  "./imag/image menu blume3.png",
  "./imag/istanbul night image.webp",
  "./imag/lady killer image.png",
  "./imag/lime space peach image.png",
  "./imag/love66 image.png",
  "./imag/marbella image.png",
  "./imag/reacter image.webp",
  "./imag/roket image.webp"
];

// ✅ تنصيب الكاش أول مرة
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
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
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// ✅ استرجاع البيانات من الكاش أو الشبكة
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
