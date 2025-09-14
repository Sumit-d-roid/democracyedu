const CACHE_NAME = 'sambhidanx-v1';
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
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && 
                           name !== CONTENT_CACHE && 
                           name !== API_CACHE)
          .map((name) => caches.delete(name))
      );
    })
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

  // API requests: network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }

  // Navigation requests (HTML) - offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
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
      })()
    );
    return;
  }

  // Static & other assets: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((resp) => {
        if (!resp || resp.status !== 200 || resp.type !== 'basic') return resp;
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return resp;
      }).catch(async () => {
        // If request is for an image, could return a placeholder in future
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