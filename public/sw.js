// Service Worker for Improtango PWA
const CACHE_NAME = 'improtango-v1';
const STATIC_CACHE = 'improtango-static-v1';
const DYNAMIC_CACHE = 'improtango-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/konseptit',
  '/about',
  '/manifest.json',
  // Core images that should be available offline
  '/images/hero-1.webp',
  '/images/og/favicon.svg',
  '/images/og/android-512x512.png'
];

// Assets to cache on demand
const DYNAMIC_ASSETS = [
  '/images/',
  '/api/',
  'https://api.convex.dev/',
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests that aren't explicitly allowed
  if (url.origin !== self.location.origin && 
      !DYNAMIC_ASSETS.some(asset => request.url.includes(asset))) {
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((networkResponse) => {
              // Cache successful responses
              if (networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => cache.put(request, responseClone));
              }
              return networkResponse;
            })
            .catch(() => {
              // Return offline page or cached fallback
              return caches.match('/') || new Response(
                '<h1>Offline</h1><p>You are currently offline. Please check your connection.</p>',
                { headers: { 'Content-Type': 'text/html' } }
              );
            });
        })
    );
    return;
  }

  // Handle image requests with cache-first strategy
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((networkResponse) => {
              // Only cache successful responses
              if (networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => cache.put(request, responseClone));
              }
              return networkResponse;
            })
            .catch(() => {
              // Return placeholder image for failed requests
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f1f5f9"/><text x="100" y="100" text-anchor="middle" fill="#64748b">Image unavailable</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            });
        })
    );
    return;
  }

  // Handle API requests with network-first strategy
  if (request.url.includes('/api/') || request.url.includes('convex.dev')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Cache GET requests only
          if (request.method === 'GET' && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Return cached version if available
          return caches.match(request);
        })
    );
    return;
  }

  // Default cache-first strategy for other requests
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        return cachedResponse || fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => cache.put(request, responseClone));
            }
            return networkResponse;
          });
      })
  );
});

// Handle background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    console.log('[SW] Handling contact form sync');
    event.waitUntil(syncContactForm());
  }
  
  if (event.tag === 'newsletter-sync') {
    console.log('[SW] Handling newsletter sync');
    event.waitUntil(syncNewsletter());
  }
});

// Sync contact form submissions when back online
async function syncContactForm() {
  try {
    // This would retrieve queued form submissions from IndexedDB
    // and send them when connection is restored
    console.log('[SW] Syncing contact form submissions');
  } catch (error) {
    console.error('[SW] Failed to sync contact form:', error);
  }
}

// Sync newsletter subscriptions when back online
async function syncNewsletter() {
  try {
    console.log('[SW] Syncing newsletter subscriptions');
  } catch (error) {
    console.error('[SW] Failed to sync newsletter:', error);
  }
}

// Push notification handler (for future use)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/images/og/android-512x512.png',
    badge: '/images/og/favicon.svg',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      {
        action: 'open',
        title: 'Avaa sivusto',
        icon: '/images/og/favicon.svg'
      },
      {
        action: 'close',
        title: 'Sulje'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Improtango', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});