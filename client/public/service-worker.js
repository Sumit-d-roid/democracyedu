/* eslint-env serviceworker */
/* eslint-disable no-undef */
// Service Worker Version (increment to bust cache)
const SW_VERSION = '6'; // bump version to invalidate old caches that stored Vite virtual modules
const CACHE_NAME = `sambhidanx-static-v${SW_VERSION}`;
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/images/sambhidanx_icon.svg'
];

const CONTENT_CACHE = `sambhidanx-content-v${SW_VERSION}`;
const API_CACHE = `sambhidanx-api-v${SW_VERSION}`;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames
      .filter((name) => ![CACHE_NAME, CONTENT_CACHE, API_CACHE].includes(name))
      .map((name) => caches.delete(name))
    );
    await self.clients.claim();
    // Notify all clients to reload (optional prompt could be implemented instead)
    const clientsList = await self.clients.matchAll({ includeUncontrolled: true });
    for (const client of clientsList) {
      client.postMessage({ type: 'SW_ACTIVATED', version: SW_VERSION });
    }
  })());
});

// Helper function to handle API requests
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Only cache GET requests - POST, PUT, DELETE should not be cached
      if (request.method === 'GET') {
        const cache = await caches.open(API_CACHE);
        cache.put(request, response.clone());
      }
      return response;
    }
    throw new Error('Network response was not ok');
  } catch (error) {
    // Only try to serve from cache for GET requests
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    throw error;
  }
}

// Fetch event - network-first strategy for API, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignore non-HTTP(S) schemes (e.g. chrome-extension://, data:, blob:, ws:, wss:)
  if (!/^https?:$/i.test(url.protocol)) return;

  const sameOrigin = url.origin === self.location.origin;

  // Don't interfere with Vite dev virtual modules or HMR endpoints.
  // These were being cached previously causing stale /@react-refresh runtime.
  if (sameOrigin && (
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.includes('__vite')
  )) {
    return; // network only, don't cache
  }

  // API requests (network-first + caching) - only same-origin
  if (sameOrigin && url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }

  // Navigation requests (HTML) - offline fallback support
  if (sameOrigin && event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;
        if (preloadResp) return preloadResp;
        return await fetch(event.request);
  } catch {
        const cache = await caches.open(CACHE_NAME);
        const offline = await cache.match('/offline.html');
        return offline || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
  })());
    return;
  }

  if (!sameOrigin) return; // only cache same-origin static assets

  // Only cache typical static asset extensions to avoid polluting cache
  const shouldCache = /\.(css|js|html|svg|png|jpg|jpeg|gif|webp|ico|json|woff2?)$/i.test(url.pathname);
  if (!shouldCache) return; // pass through

  event.respondWith((async () => {
    const cached = await caches.match(event.request, { ignoreVary: true });
    if (cached) return cached;
    try {
      const resp = await fetch(event.request);
      if (resp && resp.status === 200 && (resp.type === 'basic' || resp.type === 'cors')) {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone).catch(() => {/* ignore */});
        });
      }
      return resp;
    } catch {
      const fallback = await caches.match(event.request, { ignoreVary: true });
      return fallback || new Response('', { status: 504 });
    }
  })());
});

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'syncProgress') {
    event.waitUntil(syncProgress());
  }
});

// Sync offline progress when back online
async function syncProgress() {
  const offlineProgress = await getOfflineProgress();
  if (!offlineProgress.length) return;

  try {
    await fetch('/api/v1/progress/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ progress: offlineProgress }),
    });
    await clearOfflineProgress();
  } catch (error) {
    console.error('Failed to sync progress:', error);
  }
}

// Helper functions for managing offline progress
async function getOfflineProgress() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction('progress', 'readonly');
      const store = tx.objectStore('progress');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    } catch (e) {
      reject(e);
    }
  });
}

async function clearOfflineProgress() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction('progress', 'readwrite');
      const store = tx.objectStore('progress');
      const req = store.clear();
      req.onsuccess = () => resolve(undefined);
      req.onerror = () => reject(req.error);
    } catch (e) {
      reject(e);
    }
  });
}

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('sambhidanx-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('progress', { keyPath: 'id', autoIncrement: true });
    };
  });
}