import publicClient from "../client/public.client";
import apiCache from "../utils/cache";

const genreApi = {
  getList: async ({ mediaType }) => {
    try {
      // Check cache first - genres change rarely, cache for 24 hours
      const cacheKey = `genres:${mediaType}`;
      let cached = apiCache.get(cacheKey);
      
      if (cached) {
        return { response: cached };
      }

      const response = await publicClient.get(
        `genre/${mediaType}/list`
      );

      if (response) {
        // Cache for 24 hours
        apiCache.set(cacheKey, response);
      }

      return { response };
    } catch (err) { 
      return { err }; 
    }
  }
};

export default genreApi;