import axios from "axios";

const EXTERNAL_API = "https://api.themoviedb.org/3";

const proxyMiddleware = async (req, res, next) => {
  // Skip proxy for authentication routes which are handled locally
  if (req.path.includes("/user/signin") || 
      req.path.includes("/user/signup") || 
      req.path.includes("/user/info")) {
    return next();
  }

  try {
    // Add TMDB API key to the query parameters
    const apiKey = "1a7373401d5e0d2c52f1a7393c95d8b7";
    const params = { ...req.query, api_key: apiKey };
    
    // Forward the request to the external API
    const response = await axios({
      method: req.method,
      url: `${EXTERNAL_API}${req.path}`,
      data: req.body,
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization
      },
      params: params
    });

    // Return the response from the external API
    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ message: "Error connecting to external API" });
  }
};

export default proxyMiddleware;