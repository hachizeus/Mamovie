import privateClient from "../client/private.client";

// Since we're using TMDB API directly, we need to modify how favorites work
// For now, we'll use localStorage to store favorites
const favoriteEndpoints = {
  // These endpoints aren't used with the direct TMDB implementation
  list: "dummy/favorites",
  add: "dummy/favorites",
  remove: ({ favoriteId }) => `dummy/favorites/${favoriteId}`
};

// Use localStorage to manage favorites instead of API calls
const favoriteApi = {
  getList: async () => {
    try {
      // Get favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      return { response: favorites }; // Return favorites directly as the response
    } catch (err) { 
      console.error("Error getting favorites:", err);
      return { err }; 
    }
  },
  add: async ({
    mediaId,
    mediaType,
    mediaTitle,
    mediaPoster,
    mediaRate
  }) => {
    try {
      // Get current favorites
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      
      // Check if already in favorites
      const existingIndex = favorites.findIndex(fav => 
        fav.mediaId && mediaId && fav.mediaId.toString() === mediaId.toString()
      );
      
      // If already in favorites, return early
      if (existingIndex >= 0) {
        return { response: { favorite: favorites[existingIndex] } };
      }
      
      // Create new favorite item
      const newFavorite = {
        id: Date.now().toString(), // Generate a unique ID
        mediaId,
        mediaType,
        mediaTitle,
        mediaPoster,
        mediaRate
      };
      
      // Add to favorites
      favorites.push(newFavorite);
      
      // Save back to localStorage
      localStorage.setItem("favorites", JSON.stringify(favorites));
      
      return { response: { favorite: newFavorite } };
    } catch (err) { 
      console.error("Error adding favorite:", err);
      return { err }; 
    }
  },
  remove: async ({ favoriteId }) => {
    try {
      // Get current favorites
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      
      // Filter out the favorite to remove
      const updatedFavorites = favorites.filter(fav => fav.id !== favoriteId);
      
      // Save back to localStorage
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      
      return { response: { message: "Favorite removed" } };
    } catch (err) { 
      console.error("Error removing favorite:", err);
      return { err }; 
    }
  }
};

export default favoriteApi;