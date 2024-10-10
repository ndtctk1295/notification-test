"use client";
import localFont from "next/font/local";
import "./globals.css";
import { useEffect } from "react";
import { NotificationProvider } from "./context/NotificationContext";
import { EnableProvider } from "./context/EnableContext";
export default function RootLayout({ children }) {
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {})
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);
  return (
    <html lang="en">
      <head>
        <title>Notification App</title>
      </head>
      <body className="bg-gray-50 text-gray-900" suppressHydrationWarning={true}>
        <NotificationProvider>
          <EnableProvider>{children}</EnableProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
