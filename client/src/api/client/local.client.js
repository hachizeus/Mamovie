import axios from "axios";
import queryString from "query-string";

// Use environment variable for API URL (fallback to localhost for development)
const baseURL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? "https://mamovie-api.onrender.com/api/v1"
    : "http://localhost:5000/api/v1");

const localClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: params => queryString.stringify(params)
  }
});

localClient.interceptors.request.use(async config => {
  return {
    ...config,
    headers: {
      "Content-Type": "application/json"
    }
  };
});

localClient.interceptors.response.use((response) => {
  if (response && response.data) return response.data;
  return response;
}, (err) => {
  throw err.response ? err.response.data : new Error("Network Error");
});

export default localClient;