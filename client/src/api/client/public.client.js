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
    const cacheKey = config.url + (config.params ? '?' + queryString.stringify(config.params) : '');
    const cached = apiCache.get(cacheKey);
    if (cached) {
      // Return cached data immediately
      return Promise.resolve({ data: cached });
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
    const cacheKey = response.config.url + (response.config.params ? '?' + queryString.stringify(response.config.params) : '');
    apiCache.set(cacheKey, data);
  }

  if (response && response.data) return response.data;
  return response;
}, (err) => {
  throw err.response ? err.response.data : new Error("Network Error");
});

export default publicClient;