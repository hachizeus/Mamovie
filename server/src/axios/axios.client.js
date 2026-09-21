import axios from "axios";
import tmdbConfig from "../tmdb/tmdb.config.js";

const get = async (url) => {
  const response = await axios.get(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${tmdbConfig.token}`,
      "Accept-Encoding": "identity"
    }
  });
  return response.data;
};

export default { get };