const baseUrl = "https://api.themoviedb.org/3/";
const token = process.env.TMDB_TOKEN;

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

  // Use the Bearer token authentication
  const separator = qs ? "&" : "?";
  return `${baseUrl}${endpoint}${separator}${qs}`;
};

export default { getUrl, token };