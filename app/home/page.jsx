'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useNotification } from '../context/NotificationContext';
import { useEnable } from '../context/EnableContext';

export default function Home() {
  const [notificationEnabled, setNotificationEnabled] = useEnable();
  const [notificationMessage, setNotificationMessage] = useNotification();
  // useEffect(() => {
  //   console.log(notificationMessage);    
  // }, [notificationMessage])
  const [message, setMessage] = useState("");
// console.log(notificationEnabled);
  useEffect(() => {
    // Register the service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        // console.log('Service Worker registered with scope:', registration.scope);
      });
    }

    // Fetch the notification state from the server
    getSendPushReq();
  }, []); // Only on mount

  const getSendPushReq = () => {
    // console.log('getSendPushReq called')
    fetch('/api/send-push')
      .then((response) => response.json())
      .then((data) => {
        // console.log("data:", data)
        if (data.notificationMessage) {
          setNotificationMessage(data.notificationMessage);
          // setNotificationEnabled(data.enable);
          // console.log("current message:", notificationMessage)
        }
      });
  }

  const handleInput = (e) => {
    setMessage(e.target.value);
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Please enter a message to send.");
      return;
    }

    // Send the message to your backend API (e.g., /api/send-push)
    const response = await fetch("/api/send-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Message", message, url: "/" }),
    });

    if (response.ok) {
      setMessage(""); // Clear input field after successful submission
      getSendPushReq(); // Fetch the updated notification state
    } else {
      alert("Failed to send notification.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Show notification pop-up if enabled */}
      {notificationEnabled && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
          Notification: {notificationMessage || 'You have enabled notifications!'}
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>
      <div className="border border-gray-500 mb-4 px-4 py-4 rounded-md">
        <label htmlFor="message">Message:</label>
        <input 
          type="text" 
          id="message" 
          name="message" 
          value={message} 
          onChange={handleInput} 
        />
      </div>
      <button 
        className="px-4 py-2 bg-green-500 text-white rounded-md mb-4 hover:bg-green-600" 
        onClick={sendMessage}
      >
        Submit
      </button>
      <Link href="/settings">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Go to Settings
        </button>
      </Link>
    </div>
  );
}
