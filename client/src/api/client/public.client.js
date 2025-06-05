import axios from "axios";
import queryString from "query-string";

// Use TMDB API directly
const baseURL = "https://api.themoviedb.org/3";
const apiKey = "1a7373401d5e0d2c52f1a7393c95d8b7";

const publicClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: params => queryString.stringify(params)
  }
});

publicClient.interceptors.request.use(async config => {
  // Add API key as a proper query parameter
  const apiKeyParam = { api_key: apiKey };
  
  return {
    ...config,
    params: {
      ...config.params,
      ...apiKeyParam
    },
    headers: {
      "Content-Type": "application/json"
    }
  };
});

publicClient.interceptors.response.use((response) => {
  if (response && response.data) return response.data;
  return response;
}, (err) => {
  throw err.response ? err.response.data : new Error("Network Error");
});

export default publicClient;