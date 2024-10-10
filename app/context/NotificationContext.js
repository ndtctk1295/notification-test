import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for notifications
const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notificationMessage, setNotificationMessage] = useState('');
//   useEffect(() => {
//     // Register service worker and get subscription
//     if ('serviceWorker' in navigator) {
//       navigator.serviceWorker.register('/service-worker.js')
//         .then(async (registration) => {
//           console.log('Service Worker registered with scope:', registration.scope);

//           // Check if we already have a subscription
//           const existingSubscription = await registration.pushManager.getSubscription();
//           if (existingSubscription) {
//           } else {
//             // Request subscription
//             const newSubscription = await registration.pushManager.subscribe({
//               userVisibleOnly: true,
//               applicationServerKey: "BMh8OnwOznVZdFHnhpmZK-aAhMRtviqu0wTLX2n65ws8NzKYc4ersxq1k-j_2kAlmMiFlMEfT3RDgM4CKNS5FcU"
//             });
//           }
//         });
//     }
//   }, []);
  return (
    <NotificationContext.Provider value={[notificationMessage, setNotificationMessage]}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook to use the Notification Context
export function useNotification() {
  return useContext(NotificationContext);
}
