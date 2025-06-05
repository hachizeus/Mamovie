import privateClient from "../client/private.client";
import publicClient from "../client/public.client";

// TMDB API endpoints
const mediaEndpoints = {
  list: ({ mediaType, mediaCategory, page }) => {
    if (mediaCategory === "popular") {
      return `/${mediaType}/popular?page=${page}`;
    } else if (mediaCategory === "top_rated") {
      return `/${mediaType}/top_rated?page=${page}`;
    }
    return `/${mediaType}/${mediaCategory}?page=${page}`;
  },
  detail: ({ mediaType, mediaId }) => `/${mediaType}/${mediaId}`,
  search: ({ mediaType, query, page }) => `/search/${mediaType}?query=${query}&page=${page}`
};

const mediaApi = {
  getList: async ({ mediaType, mediaCategory, page }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.list({ mediaType, mediaCategory, page })
      );

      return { response };
    } catch (err) { return { err }; }
  },
  getDetail: async ({ mediaType, mediaId }) => {
    try {
      const response = await privateClient.get(
        mediaEndpoints.detail({ mediaType, mediaId })
      );

      return { response };
    } catch (err) { return { err }; }
  },
  search: async ({ mediaType, query, page }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.search({ mediaType, query, page })
      );

      return { response };
    } catch (err) { return { err }; }
  }
};

export default mediaApi;