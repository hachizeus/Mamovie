import axios from "axios";
import queryString from "query-string";
import apiCache from "../utils/cache";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const publicClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: params => queryString.stringify(params)
  }
});

publicClient.interceptors.request.use(async config => {
  // Check cache for GET requests (safe to cache)
  if (config.method === 'get' || config.method === undefined) {
    const cached = apiCache.get(config.url, config.params);
    if (cached) {
      // Return cached data as a resolved promise
      return Promise.reject({
        config,
        response: { data: cached },
        message: 'Cache hit'
      });
    }
  }

  return {
    ...config,
    headers: {
      "Content-Type": "application/json"
    }
  };
});

publicClient.interceptors.response.use((response) => {
  // Cache successful GET responses
  if (response.config.method === 'get' || response.config.method === undefined) {
    const data = response.data;
    apiCache.set(response.config.url, data, response.config.params);
  }

  if (response && response.data) return response.data;
  return response;
}, (err) => {
  // Handle cache hits
  if (err.message === 'Cache hit' && err.response) {
    return err.response.data;
  }
  throw err.response ? err.response.data : new Error("Network Error");
});

export default publicClient;