// Gang Gang — Service Worker
// Handles push notifications in the background

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Gang Gang', {
      body: data.body || '',
      icon: data.icon || '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag || 'gang-gang',       // prevents duplicate notifications
      renotify: data.renotify || false,
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // If app is already open, focus it
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      // Otherwise open a new window
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
