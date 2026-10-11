/* Firebase Cloud Messaging Service Worker. Deve ficar na raiz do site. */
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDQKozcgf4N70cxUiUGJekGcUTClU2Httg",
  authDomain: "jardim-gatos-teste.firebaseapp.com",
  projectId: "jardim-gatos-teste",
  storageBucket: "jardim-gatos-teste.firebasestorage.app",
  messagingSenderId: "257294626705",
  appId: "1:257294626705:web:130481b8778d8a9eceb430",
  measurementId: "G-87FZWZWHXX"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || '💌 Nova cartinha — Jardim dos Gatinhos';
  const options = {
    body: payload.notification?.body || 'Seu amor mandou uma mensagem!',
    icon: './favicon.ico',
    data: { url: './' },
    tag: payload.data?.letterId || 'jardim-dos-gatinhos-carta',
    renotify: true
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || './', self.location.origin).href;
  event.waitUntil((async () => {
    const clientsList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientsList) {
      if ('focus' in client) { await client.focus(); return; }
    }
    if (clients.openWindow) await clients.openWindow(target);
  })());
});
