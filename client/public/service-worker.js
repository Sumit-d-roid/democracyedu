// Version bump to force clients to pick up new logic
const CACHE_NAME = 'sambhidanx-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/images/sambhidanx_icon.svg'
];

const CONTENT_CACHE = 'sambhidanx-content-v1';
const API_CACHE = 'sambhidanx-api-v1';

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
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== CONTENT_CACHE && name !== API_CACHE)
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

// Helper function to handle API requests
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
      return response;
    }
    throw new Error('Network response was not ok');
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Fetch event - network-first strategy for API, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignore non-HTTP(S) schemes (e.g. chrome-extension://, data:, blob:, ws:, wss:)
  if (!/^https?:$/i.test(url.protocol)) {
    return; // do not intercept
  }

  const sameOrigin = url.origin === self.location.origin;

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
        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (_) {
        const cache = await caches.open(CACHE_NAME);
        const offline = await cache.match('/offline.html');
        return offline || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
    })());
    return;
  }

  // Only handle static assets for same-origin
  if (!sameOrigin) {
    return; // pass through
  }

  event.respondWith(
    caches.match(event.request, { ignoreVary: true }).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((resp) => {
        if (!resp || resp.status !== 200 || (resp.type !== 'basic' && resp.type !== 'cors')) return resp;
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone).catch(() => { /* swallow */ });
        });
        return resp;
      }).catch(async () => {
        // When offline, attempt cached match again (already ignoreVary)
        const fallback = await caches.match(event.request, { ignoreVary: true });
        if (fallback) return fallback;
        return new Response('', { status: 504 });
      });
    })
  );
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