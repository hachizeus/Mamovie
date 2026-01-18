import axios from "axios";
import queryString from "query-string";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const privateClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: params => queryString.stringify(params)
  }
});

privateClient.interceptors.request.use(async config => {
  // For external API calls, use proxy
  if (config.url.includes('moonflix')) {
    config.url = `/proxy?url=${encodeURIComponent(`https://moonflix-api.vercel.app/api/v1${config.url}`)}`;
  }
  
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