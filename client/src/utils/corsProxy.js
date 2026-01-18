import publicClient from "../api/client/public.client";

export const fetchWithProxy = async (url) => {
  try {
    const response = await publicClient.get(`/proxy?url=${encodeURIComponent(url)}`);
    return response;
  } catch (error) {
    throw error;
  }
};