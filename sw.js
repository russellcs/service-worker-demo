/* eslint-disable no-restricted-globals */
/* global self */
const CACHE_NAME = "my-site-cache-v1";
const urlsToCache = [
  "/index.html",
  "/styles/styles.css",
  "/scripts/main.js",
  "load_sw.js",
];

self.addEventListener("install", function (event) {
  self.skipWaiting();

  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", function (event) {
  var cacheWhitelist = ["pages-cache-v1", "blog-posts-cache-v1"];

  self.clients.claim(); // takes control of all open pages that use this SW

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        // eslint-disable-next-line array-callback-return
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  console.log("Fetching detected", event.request);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (
        event.request.cache === "only-if-cached" &&
        event.request.mode !== "same-origin"
      ) {
        return;
      }
      if (response) {
        console.log("cache hit", response);
        return response;
      }
      console.log("cache miss. fetching...");

      return fetch(event.request).then(function (response) {
        // Check if we received a valid response
        if (!response || response.status !== 200) {
          console.log("invalid response", response);
          return response;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        let responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          console.log(`Writing to cache: ${CACHE_NAME}: ${responseToCache}`);
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
