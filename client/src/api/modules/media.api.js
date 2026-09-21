import privateClient from "../client/private.client";
import publicClient from "../client/public.client";

const mediaApi = {
  getList: async ({ mediaType, mediaCategory, page = 1 }) => {
    try {
      const response = await publicClient.get(
        `${mediaType}/${mediaCategory}`,
        { params: { page } }
      );
      return { response };
    } catch (err) { 
      return { err }; 
    }
  },

  getDetail: async ({ mediaType, mediaId }) => {
    try {
      const response = await privateClient.get(
        `${mediaType}/${mediaId}`
      );
      return { response };
    } catch (err) { 
      return { err }; 
    }
  },

  search: async ({ mediaType, query, page = 1 }) => {
    try {
      const response = await publicClient.get(
        `search/${mediaType}`,
        { params: { query, page } }
      );
      return { response };
    } catch (err) { 
      return { err }; 
    }
  }
};

export default mediaApi;