const CACHE_NAME = 'norma-1778889118508';
const STATIC_ASSETS = [
  '/',
  '/chi-siamo',
  '/fonti',
  '/costituzione',
  '/istituzioni',
];

// INSTALL — cache assets statici
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE — rimuove cache vecchie
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// FETCH — network first, fallback cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

// PUSH — riceve notifiche push da OneSignal o server
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Norma';
  const options = {
    body: data.body || 'Nuovo aggiornamento disponibile.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    image: data.image || undefined,
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Leggi ora' },
      { action: 'close', title: 'Chiudi' },
    ],
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// NOTIFICATIONCLICK — apre la pagina al click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'close') return;
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// AUTO-UPDATE — controlla aggiornamenti ogni volta che l'app torna in foreground
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
