import axios from "axios";
import queryString from "query-string";

// Use Moonflix API which was working before
const baseURL = "https://moonflix-api.vercel.app/api/v1";

const publicClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: params => queryString.stringify(params)
  }
});

publicClient.interceptors.request.use(async config => {
  return {
    ...config,
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