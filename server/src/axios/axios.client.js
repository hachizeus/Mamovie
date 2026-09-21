import axios from "axios";
import tmdbConfig from "../tmdb/tmdb.config.js";

const get = async (url) => {
  try {
    console.log(`[axios] GET ${url}`);
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${tmdbConfig.token}`,
        "Accept-Encoding": "identity"
      }
    });
    console.log(`[axios] Success: ${response.status}`);
    return response.data;
  } catch (error) {
    console.error(`[axios] Error: ${error.message}`);
    if (error.response) {
      console.error(`[axios] Status: ${error.response.status}`);
      console.error(`[axios] Data:`, error.response.data);
    }
    throw error;
  }
};

export default { get };