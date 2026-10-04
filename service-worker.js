const CACHE_NAME = "shustho-poth-static-v8";
const LOCAL_ASSETS = [
  "./",
  "./index.html",
  "./ai.js",
  "./app.js",
  "./facilities_dghs_sample.json",
  "./facilities_georeferenced_demo.json",
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
async function findNearbyFacilities() {
  const resultBox = document.getElementById("nearby-facilities");

  if (!resultBox) return;

  resultBox.innerHTML = `
    <div class="notice">
      Looking for your location…
    </div>
  `;

  if (!navigator.geolocation) {
    resultBox.innerHTML = `
      <div class="notice">
        Location is not available on this device.
        You can still choose your Bangladesh area above.
      </div>
    `;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async position => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      try {
        const response = await fetch("./facilities_georeferenced_demo.json");

        if (!response.ok) {
          throw new Error("Facility data could not be loaded.");
        }

        const data = await response.json();

        const facilities = data.records
          .filter(
            facility =>
              Number.isFinite(Number(facility.latitude)) &&
              Number.isFinite(Number(facility.longitude))
          )
          .map(facility => ({
            ...facility,
            distance_km: haversineDistance(
              userLat,
              userLon,
              Number(facility.latitude),
              Number(facility.longitude)
            )
          }))
          .sort((a, b) => a.distance_km - b.distance_km);

        if (!facilities.length) {
          resultBox.innerHTML = `
            <div class="notice">
              No georeferenced facilities are available in this
              prototype subset.
            </div>
          `;
          return;
        }

        const nearest = facilities[0];

        resultBox.innerHTML = `
          <div class="nearby-result">

            <div class="notice">
              <b>Nearest listed facility in this prototype</b>
            </div>

            <div class="facility-card">

              <h3>${escapeHtml(nearest.name)}</h3>

              <p class="bangla-name">
                ${escapeHtml(nearest.name_bn || "")}
              </p>

              <p>
                ${escapeHtml(nearest.type)}
                · ${escapeHtml(nearest.district)}
              </p>

              <p class="distance">
                <b>${nearest.distance_km.toFixed(1)} km away</b>
              </p>

              <a
                class="button-small"
                href="https://www.google.com/maps/dir/?api=1&destination=${nearest.latitude},${nearest.longitude}"
                target="_blank"
                rel="noopener"
              >
                Get directions →
              </a>

            </div>

            <p class="muted">
              Approximate straight-line distance, not travel time.
              This is only a small georeferenced prototype subset.
            </p>

            <p class="muted">
              Facility information should be verified before travel.
            </p>

          </div>
        `;

      } catch (error) {

        resultBox.innerHTML = `
          <div class="notice">
            Nearby facility data could not be loaded.
            Please try again or use the Bangladesh area selector.
          </div>
        `;

      }
    },

    () => {

      resultBox.innerHTML = `
        <div class="notice">
          Location permission was not provided.
          You can still choose your Bangladesh area or ask a
          health worker for navigation help.
        </div>
      `;

    },

    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000
    }
  );
}


function haversineDistance(lat1, lon1, lat2, lon2) {

  const earthRadiusKm = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadiusKm * c;
}


function toRadians(value) {
  return value * Math.PI / 180;
}


function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


const findNearbyButton =
  document.getElementById("findNearbyButton");

if (findNearbyButton) {
  findNearbyButton.addEventListener(
    "click",
    findNearbyFacilities
  );
}
