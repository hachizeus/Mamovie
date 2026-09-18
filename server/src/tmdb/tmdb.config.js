const baseUrl = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const token = process.env.TMDB_TOKEN;

const getUrl = (endpoint, params) => {
  const qs = new URLSearchParams(params);
  const queryString = qs.toString() ? `&${qs}` : "";
  return `${baseUrl}/${endpoint}?api_key=${process.env.TMDB_KEY || ""}&${queryString}`.replace(/\?&/, "?");
};

// Enhanced version with Bearer token support
const get = async (url, axiosInstance) => {
  try {
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    });
    return response.data;
  } catch (error) {
    console.error(`TMDB API Error: ${error.message}`, { url, token: token ? "set" : "missing" });
    throw error;
  }
};

export default { getUrl, get, baseUrl, token };