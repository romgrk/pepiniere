/*
 * service-worker.js
 */

import hash from 'object-hash'
import routes from './routes'

const assets = self.__WB_MANIFEST;

// Names of the two caches used in this version of the service worker.
const PRECACHE = `precache-${hash(assets)}`;
const RUNTIME = 'runtime';

const CACHE_ORIGINS = [
  self.location.origin,
  'https://fonts.googleapis.com',
]

const INDEX = '/index.html'

// A list of local resources we always want to be cached.
const PRECACHE_URLS = assets.map(a => a.url);
const FRONTEND_URLS = routes.map(r => r.path)

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  console.log('installing', assets)
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  console.log('activating', currentCaches)
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    })
    .then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheName => {
        return caches.delete(cacheName);
      }));
    })
    .then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  // Skip cross-origin requests, like those for Google Analytics.
  if (!CACHE_ORIGINS.some(o => event.request.url.startsWith(o))) {
    console.log('skipping', event.request.url)
    return;
  }

  if (url.origin === self.location.origin
    && (
         url.pathname === '/'
      || FRONTEND_URLS.some(u => url.pathname.startsWith(u))
    )
  ) {
    console.log('frontend route', event.request.url, url.pathname, FRONTEND_URLS.find(u => url.pathname.startsWith(u)))
    event.respondWith(
      caches.match(INDEX).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        console.log('failed index cache')
        debugger
        return fetch(event.request)
      })
    ) 
    return;
  }

  if (url.pathname.startsWith('/api')
    && !url.pathname.startsWith('/api/member/photo/')) {
    console.log('skipping API', event.request.url, url.pathname)
    return;
  }

  // Use cache for assets plus member photos
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        console.log('cached', event.request.url)
        return cachedResponse;
      }

      console.log('requesting', event.request.url)
      return caches.open(RUNTIME).then(cache => {
        return fetch(event.request).then(response => {
          // Put a copy of the response in the runtime cache.
          return cache.put(event.request, response.clone()).then(() => {
            return response;
          });
        });
      });
    })
  );
});
