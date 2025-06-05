import axios from "axios";
import queryString from "query-string";

// Use TMDB API directly
const baseURL = "https://api.themoviedb.org/3";
const apiKey = "825648da234f5ffcbd4d21d9b99f4af0";

const privateClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: params => queryString.stringify(params)
  }
});

privateClient.interceptors.request.use(async config => {
  // Add API key as a proper query parameter
  const apiKeyParam = { api_key: apiKey };
  
  // Get the access token from your TMDB account
  const tmdbToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MjU2NDhkYTIzNGY1ZmZjYmQ0ZDIxZDliOTlmNGFmMCIsIm5iZiI6MTc0ODc3OTY4MC4xMzkwMDAyLCJzdWIiOiI2ODNjNDJhMGU3OGZmYWRmODI1MzdlMzMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.i6izu6FxAMqY_dxhuVCSFyVdOhzdOHZSlU21lfBOzyY";
  
  return {
    ...config,
    params: {
      ...config.params,
      ...apiKeyParam
    },
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${tmdbToken}`
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