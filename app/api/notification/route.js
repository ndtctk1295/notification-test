import { getState, updateState } from '@/app/state';
  
  export async function GET() {
    return new Response(JSON.stringify(getState()), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  export async function POST(request) {
    const { message, notificationEnabled } = await request.json();
    const newStateData = {
      notificationMessage: message || getState().notificationMessage,
      enable: notificationEnabled !== undefined ? notificationEnabled : getState().enable
    };
    console.log("POST request:", getState());
    updateState(newStateData);
    return new Response(
      JSON.stringify({
        success: true,
        data: getState(),
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  