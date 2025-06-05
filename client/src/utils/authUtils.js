// Authentication utility functions

// Check if user is logged in by verifying token in localStorage
export const isUserLoggedIn = () => {
  const token = localStorage.getItem("actkn");
  return !!token;
};

// Store user data in localStorage for persistence
export const storeUserData = (userData) => {
  if (!userData) {
    localStorage.removeItem("actkn");
    localStorage.removeItem("user_data");
    return;
  }
  
  if (userData.token) {
    localStorage.setItem("actkn", userData.token);
  }
  
  // Store user data without sensitive information
  const userToStore = {
    id: userData.id,
    username: userData.username,
    displayName: userData.displayName,
    subscription: userData.subscription
  };
  
  localStorage.setItem("user_data", JSON.stringify(userToStore));
};

// Get stored user data
export const getStoredUserData = () => {
  try {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing stored user data:", error);
    return null;
  }
};

// Clear user data on logout
export const clearUserData = () => {
  localStorage.removeItem("actkn");
  localStorage.removeItem("user_data");
};