const CACHE_NAME = 'sambhidanx-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/images/sambhidanx_icon.svg',
  // Add other static assets here
];

const CONTENT_CACHE = 'sambhidanx-content-v1';
const API_CACHE = 'sambhidanx-api-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames
        .filter((name) => name !== CACHE_NAME && name !== CONTENT_CACHE && name !== API_CACHE)
        .map((name) => caches.delete(name))
    )).then(() => self.clients.claim())
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

  // Skip non-http(s) schemes (e.g., chrome-extension://) which cannot be cached
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return; // allow default handling, don't attempt to cache
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((networkResponse) => {
        // Only cache successful, same-origin or font/css (to improve offline UX)
        const isOk = networkResponse && networkResponse.status === 200;
        const cacheableTypes = ['basic', 'cors'];
        const isCacheableType = cacheableTypes.includes(networkResponse.type);
        const isFontOrStyle = /\.(?:woff2?|ttf|otf)$/i.test(url.pathname) || networkResponse.headers.get('content-type')?.includes('text/css');

        if (isOk && (isCacheableType || isFontOrStyle)) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {/* ignore put errors */});
          });
        }
        return networkResponse;
      }).catch(() => {
        // Optionally could return a fallback page or asset here
        return response; // if we had an earlier cached response
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
    await fetch('/api/learning/sync-progress', {
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
  return db.getAll('progress');
}

async function clearOfflineProgress() {
  const db = await openDB();
  return db.clear('progress');
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