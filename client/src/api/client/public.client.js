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

publicClient.interceptors.request.use(config => {
  // Add header
  return {
    ...config,
    headers: {
      "Content-Type": "application/json"
    }
  };
});

publicClient.interceptors.response.use((response) => {
  // Cache successful GET requests
  if (response.config.method === 'get' || response.config.method === undefined) {
    const cacheKey = response.config.url + (response.config.params ? '?' + queryString.stringify(response.config.params) : '');
    apiCache.set(cacheKey, response.data);
  }

  // Return the data directly (unwrap from axios response envelope)
  if (response && response.data) {
    return response.data;
  }
  return response;
}, (err) => {
  // For errors, return the error response data if available
  if (err.response && err.response.data) {
    throw err.response.data;
  }
  throw new Error("Network Error");
});

export default publicClient;