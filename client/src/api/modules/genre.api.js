import publicClient from "../client/public.client";
import apiCache from "../utils/cache";

const genreEndpoints = {
  list: ({ mediaType }) => `${mediaType}/genres`
};

const genreApi = {
  getList: async ({ mediaType }) => {
    try {
      // Genres don't change frequently, cache for 24 hours
      const cachedGenres = apiCache.get(
        genreEndpoints.list({ mediaType }),
        { mediaType }
      );
      
      if (cachedGenres) {
        return { response: cachedGenres };
      }

      const response = await publicClient.get(genreEndpoints.list({ mediaType }));

      // Cache for 24 hours (86400000 ms)
      apiCache.set(
        genreEndpoints.list({ mediaType }),
        response,
        { mediaType },
        24 * 60 * 60 * 1000
      );

      return { response };
    } catch (err) { return { err }; }
  }
};

export default genreApi;