const CACHE_NAME = 'sambhidanx-v1';
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
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
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