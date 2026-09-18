const baseUrl = "https://api.themoviedb.org/3";
const token = process.env.TMDB_TOKEN;

const getUrl = (endpoint, params) => {
  const qs = new URLSearchParams(params || {});
  const queryString = qs.toString();
  return `${baseUrl}/${endpoint}${queryString ? `?${queryString}` : ""}`;
};

export default { getUrl, baseUrl, token };