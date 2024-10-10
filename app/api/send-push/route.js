import webPush from 'web-push';
import { getState, updateState } from '@/app/state';
// console.log(getState());
// console.log('Public Key:', vapidKeys.publicKey);
// console.log('Private Key:', vapidKeys.privateKey);
if(!getState().enable){
  console.log("notification is off:", getState());
}
const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

// Set VAPID details
webPush.setVapidDetails(
  'mailto:your-email@example.com', // Replace with your email
  publicVapidKey,
  privateVapidKey
);

// Store subscription objects in-memory (for demonstration purposes)
let subscriptions = [];
// console.log(subscriptions);

export async function POST(request) {
  const {title, message, url } = await request.json();
  const newStateData = {
    notificationMessage: message || getState().message,
  }
  updateState(newStateData);
  // Prepare the payload for the push notification
  const payload = JSON.stringify({ title, message, url });
  // Send the notification to each subscription
  
  // self.registration.showNotification(payload.title, payload.message);
  if(getState().enable){
    if (subscriptions.length === 0) {
      console.log("No subscriptions to send notifications to.");
    } else {
      const sendPromises = subscriptions.map(async (subscription) => {
        try {
          await webPush.sendNotification(subscription, payload);
          console.log("webPush sent!!!");
        } catch (error) {
          console.error('Push error:', error);
        }
      });
      await Promise.all(sendPromises);
    }
  } else {
    console.log("Notifications are disabled.");
  }
  console.log("in the POST request" ,getState());
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT(request) {
  const subscription = await request.json();
  // console.log(subscription);
  // Avoid duplicate subscriptions
  if (!subscriptions.some((sub) => JSON.stringify(sub) === JSON.stringify(subscription))) {
    subscriptions.push(subscription);
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET() {
  console.log("in the GET request:", getState());
  return new Response(JSON.stringify(getState()), {
    headers: { 'Content-Type': 'application/json' },
  });
}
