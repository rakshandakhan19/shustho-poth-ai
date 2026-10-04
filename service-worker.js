const CACHE_NAME = "shustho-poth-static-v7";
const LOCAL_ASSETS = [
  "./",
  "./index.html",
  "./ai.js",
  "./app.js",
  "./facilities_dghs_sample.json",
  "./facilities_demo.json",
  "./data/ai/local_language_dataset.csv",
  "./data/ai/independent_test_set.csv",
  "./data/ai/intents.json",
  "./data/geography/bangladesh_locations.json",
  "./data/geography/bangladesh_locations.js",
  "./data/health_access/bangladesh_health_facilities.json",
  "./data/health_access/service_delivery_indicators.json",
  "./data/context/who_bangladesh_health_priorities.json",
  "./evaluation_cases_independent.json",
  "./evaluation_results_independent.json",
  "./data/context/who_bangladesh_health_priorities_summary.js",
  "./data/context/who_health_priority_mapping.json",
  "./data/context/global_findex_bangladesh.json",
  "./data/context/gsma_mobile_gender_gap_bangladesh.json",
  "./data/benchmarks/massive_reference.json",
  "./intents.json",
  "./referral_rules.json",
  "./evaluation_cases.csv",
  "./evaluation_cases.json",
  "./results.json",
  "./LICENSE",
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
  const url = new URL(event.request.url);

  if (
    event.request.method !== "GET" ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  const core = /\/(index\.html|app\.js|ai\.js)?$/.test(url.pathname);

  const store = response => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => {
        cache.put(event.request, copy);
      });
    }
    return response;
  };

  event.respondWith(
    core
      ? fetch(event.request)
          .then(store)
          .catch(() =>
            caches.match(event.request).then(
              cached => cached || caches.match("./index.html")
            )
          )
      : caches
          .match(event.request)
          .then(
            cached =>
              cached ||
              fetch(event.request).then(store)
          )
          .catch(() =>
            event.request.mode === "navigate"
              ? caches.match("./index.html")
              : Response.error()
          )
  );
});
