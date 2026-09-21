const baseUrl = process.env.TMDB_BASE_URL;
const key = process.env.TMDB_KEY;

const getUrl = (endpoint, params) => {
  let qs = "";
  if (params && Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) {
        queryParams.append(k, v);
      }
    }
    qs = queryParams.toString();
  }

  const separator = qs ? "&" : "?";
  return `${baseUrl}${endpoint}?api_key=${key}${qs ? separator + qs : ""}`;
};

export default { getUrl };