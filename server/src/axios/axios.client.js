import axios from "axios";
import tmdbConfig from "../tmdb/tmdb.config.js";

const get = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${tmdbConfig.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Encoding": "identity"
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Axios request failed: ${error.message}`, { url });
    throw error;
  }
};

export default { get };