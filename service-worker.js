const CACHE_NAME = "shustho-poth-static-v1";
const LOCAL_ASSETS = [
  "./",
  "./index.html",
  "./ai.js",
  "./app.js",
  "./facilities_dghs_sample.json",
  "./facilities_demo.json",
  "./intents.json",
  "./referral_rules.json",
  "./data/who_bangladesh_health_priorities_summary.js",
  "./data/who_bangladesh_health_priorities.json",
  "./data/who_health_priority_mapping.json"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(LOCAL_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("shustho-poth-static-") && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); }
    return response;
  }).catch(() => event.request.mode === "navigate" ? caches.match("./index.html") : Response.error())));
});
