/* Power Gym PWA service worker (minimal) */
const CACHE_NAME = "power-gym-pwa-v1";
const PRECACHE_URLS = ["./index.html", "./manifest.webmanifest", "./fade out.png", "./logo.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(caches.match("./index.html").then((cached) => cached || fetch(req)));
    return;
  }

  event.respondWith(caches.match(req).then((cached) => cached || fetch(req)));
});

