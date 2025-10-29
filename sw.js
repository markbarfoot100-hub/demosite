const CACHE_NAME = 'cosmic-cannabis-v1';
const urlsToCache = [
  '/',
  '/src/react-app/main.tsx',
  '/src/react-app/index.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://mocha-cdn.com/019a2ada-c91b-7c1b-9da0-94076d92107c/logo-psychedelic-leaf.png',
  'https://mocha-cdn.com/019a2ada-c91b-7c1b-9da0-94076d92107c/hero-psychedelic-cannabis.jpg',
  'https://mocha-cdn.com/019a2ada-c91b-7c1b-9da0-94076d92107c/product-bg-psychedelic.jpg'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/demosite/sw.js')
    .then(reg => console.log('Service Worker registered:', reg))
    .catch(err => console.error('SW registration failed:', err));
}

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache API responses and static assets
          if (event.request.url.includes('/api/') || 
              event.request.destination === 'image' ||
              event.request.destination === 'script' ||
              event.request.destination === 'style') {
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }

          return response;
        });
      }).catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});

// Background sync for when the app comes back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Sync any pending data when online
  return Promise.resolve();
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: 'https://mocha-cdn.com/019a2ada-c91b-7c1b-9da0-94076d92107c/logo-psychedelic-leaf.png',
    badge: 'https://mocha-cdn.com/019a2ada-c91b-7c1b-9da0-94076d92107c/logo-psychedelic-leaf.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore Products',
        icon: 'https://mocha-cdn.com/019a2ada-c91b-7c1b-9da0-94076d92107c/logo-psychedelic-leaf.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: 'https://mocha-cdn.com/019a2ada-c91b-7c1b-9da0-94076d92107c/logo-psychedelic-leaf.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Cosmic Cannabis', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/products')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
