// Gang Gang — Service Worker
// Handles push notifications in the background

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Gang Gang', {
      body: data.body || '',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag || 'gang-gang',
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: data.url || '/', tag: data.tag || '' }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const tag = event.notification.data?.tag || '';
  // Deep link to games tab for game notifications
  const isGame = tag.startsWith('game-');
  const targetUrl = isGame ? '/?tab=games' : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) {
          if (isGame) client.postMessage({ type: 'OPEN_TAB', tab: 'games' });
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
