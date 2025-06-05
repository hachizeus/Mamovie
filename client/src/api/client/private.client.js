import axios from "axios";
import queryString from "query-string";

const baseURL = process.env.REACT_APP_API_URL || "https://api.themoviedb.org/3";
const apiKey = process.env.REACT_APP_TMDB_KEY || "1a7373401d5e0d2c52f1a7393c95d8b7";

const privateClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: params => queryString.stringify(params)
  }
});

privateClient.interceptors.request.use(async config => {
  // Add API key to all requests
  config.params = {
    ...config.params,
    api_key: apiKey
  };
  
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("actkn")}`
    }
  };
});

privateClient.interceptors.response.use((response) => {
  if (response && response.data) return response.data;
  return response;
}, (err) => {
  throw err.response ? err.response.data : new Error("Network Error");
});

export default privateClient;