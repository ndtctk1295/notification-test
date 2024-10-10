self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated.');
});

self.addEventListener('push', (event) => {
    console.log('Push event received:', event);
    const data = event.data ? event.data.json() : {};
    // console.log('Push data:', data);
    const options = {
        body: data.message || 'You have a new notification!',
        data: { url: data.url || '/' } // Optional: Data to use for the notification click event
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Notification', options)
    );
});

// Optional: Handle notification click event
self.addEventListener('notificationclick', (event) => {
    // console.log('Notification click event:', event);
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url) // Open the URL associated with the notification
    );
});
