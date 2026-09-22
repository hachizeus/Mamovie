import axios from "axios";
import queryString from "query-string";
import apiCache from "../utils/cache";

const publicClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  paramsSerializer: {
    encode: params => queryString.stringify(params)
  }
});

publicClient.interceptors.request.use(config => {
  // Add TMDB API key to all requests
  config.params = config.params || {};
  config.params.api_key = process.env.REACT_APP_TMDB_API_KEY;

  // For GET requests, check if we have cached data
  if ((config.method === 'get' || config.method === undefined)) {
    const cacheKey = config.url + (config.params ? '?' + queryString.stringify(config.params) : '');
    const cached = apiCache.get(cacheKey);
    
    if (cached) {
      console.log(`[Cache HIT] ${cacheKey}`);
      // Return a custom adapter that provides the cached data
      config.adapter = () => Promise.resolve({ 
        status: 200, 
        data: cached, 
        config,
        statusText: 'OK',
        headers: {}
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
  // Cache successful GET requests with appropriate TTL
  if (response.config.method === 'get' || response.config.method === undefined) {
    const cacheKey = response.config.url + (response.config.params ? '?' + queryString.stringify(response.config.params) : '');
    
    // Determine TTL based on endpoint type
    let ttl = 5 * 60 * 1000; // default 5 minutes
    if (cacheKey.includes('/detail/')) {
      ttl = 2 * 60 * 60 * 1000; // detail pages: 2 hours
    } else if (cacheKey.includes('/genre')) {
      ttl = 24 * 60 * 60 * 1000; // genres: 24 hours
    } else if (cacheKey.includes('popular') || cacheKey.includes('top_rated')) {
      ttl = 60 * 60 * 1000; // lists: 1 hour
    }
    
    apiCache.set(cacheKey, response.data, {}, ttl);
    console.log(`[Cache SET] ${cacheKey} (TTL: ${ttl / 1000 / 60}m)`);
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