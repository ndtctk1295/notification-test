'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useNotification } from '../context/NotificationContext';
import { useEnable } from '../context/EnableContext';
export default function Settings() {
  const [notificationEnabled, setNotificationEnabled, toggleFunc] = useEnable();
  const [notificationMessage, setNotificationMessage] = useNotification();
  const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  // console.log(notificationEnabled);
  useEffect(() => {
    // Fetch the current notification state and message from the API
    fetch('/api/send-push')
      .then((response) => response.json())
      .then((data) => {
        setNotificationMessage(data.message);
        setNotificationEnabled(data.enable);
      });
  }, []);

  // Function to subscribe to push notifications
  const subscribeToPush = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicVapidKey, // Replace with your VAPID public key
        });
        console.log('Push subscription:', JSON.stringify(subscription));
        // Send the subscription object to the server
          const response = await fetch('/api/send-push', {
          method: 'PUT', // Use PUT to save the subscription
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        });
      } catch (error) {
        console.error('Push subscription error:', error);
      }
    }
  };

  const toggleNotification = async () => {
    const newState = !notificationEnabled;
    // console.log(newState)
    toggleFunc();
    // Send POST request to update the state on the server
    await fetch('/api/notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'You have enabled notifications!',
        notificationEnabled: newState
      }),
    })
    // Subscribe to push notifications if enabled
    if (newState) {
      await subscribeToPush();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Settings Page</h1>
      <div className="flex items-center mb-4">
        <span className="mr-2">Enable Notifications</span>
        <button
          onClick={toggleNotification}
          className={`${
            notificationEnabled ? 'bg-green-500' : 'bg-gray-300'
          } p-2 rounded-full transition`}
        >
          {notificationEnabled ? 'ON' : 'OFF'}
        </button>
      </div>
      <Link href="/home">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Back to Home
        </button>
      </Link>
    </div>
  );
}
