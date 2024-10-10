import React, { createContext, useContext, useState } from 'react';

// Create a Context for the notification message
const enableContext = createContext();

// Create a Provider component
export const EnableProvider = ({ children }) => {
  const toggleNotification = async () => {
    if (notificationEnabled) {
      // Disable notifications
      setNotificationEnabled(false);
    } else {
      // Enable notifications
      if (Notification.permission === 'default') {
        // Request permission if not already granted
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotificationEnabled(true);
          console.log('permission granted')
        } else {
          alert("Notifications are disabled. Please enable them in your browser settings.");
        }
      } else if (Notification.permission === 'granted') {
        setNotificationEnabled(true);
        console.log('permission granted')
      } else {
        alert("Notifications are disabled. Please enable them in your browser settings.");
      }
    }
  };

  const [notificationEnabled, setNotificationEnabled] = useState(false);
  return (
    <enableContext.Provider value={[ notificationEnabled, setNotificationEnabled, toggleNotification ]}>
      {children}
    </enableContext.Provider>
  );
};

// Custom hook to use the Notification Context
export const useEnable = () => useContext(enableContext);

