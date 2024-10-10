// state.js

// Create a module-scoped shared state store that won't reset on re-import.
let sharedState = global.sharedState || {
  notificationMessage: 'Default Notification Message',
  enable: false,
};

// Ensure that the global variable is set only once.
if (!global.sharedState) {
  global.sharedState = sharedState;
}

// Getter function to access the state.
export const getState = () => global.sharedState;

// Update function to modify the state.
export const updateState = (newState) => {
  global.sharedState = { ...global.sharedState, ...newState };
};
