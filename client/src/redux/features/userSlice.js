import { createSlice } from "@reduxjs/toolkit";

// Get stored user data from localStorage
const getStoredUser = () => {
  try {
    const token = localStorage.getItem("actkn");
    const userData = localStorage.getItem("user_data");
    return userData && token ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing stored user data:", error);
    return null;
  }
};

// Store user data in localStorage
const storeUser = (userData) => {
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

export const userSlice = createSlice({
  name: "User",
  initialState: {
    user: getStoredUser(),
    listFavorites: []
  },
  reducers: {
    setUser: (state, action) => {
      storeUser(action.payload);
      state.user = action.payload;
    },
    setListFavorites: (state, action) => {
      state.listFavorites = action.payload;
    },
    removeFavorite: (state, action) => {
      const { mediaId } = action.payload;
      state.listFavorites = [...state.listFavorites].filter(e => e.mediaId.toString() !== mediaId.toString());
    },
    addFavorite: (state, action) => {
      state.listFavorites = [action.payload, ...state.listFavorites];
    }
  }
});

export const {
  setUser,
  setListFavorites,
  addFavorite,
  removeFavorite
} = userSlice.actions;

export default userSlice.reducer;