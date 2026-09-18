import axios from "axios";
import tmdbConfig from "../tmdb/tmdb.config.js";

const get = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${tmdbConfig.token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error(`TMDB API Error: ${error.message}`, { url, hasToken: !!tmdbConfig.token });
    throw error;
  }
};

export default { get };