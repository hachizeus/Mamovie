import axios from "axios";

const EXTERNAL_API = "https://moonflix-api.vercel.app/api/v1";

const proxyMiddleware = async (req, res, next) => {
  // Skip proxy for authentication routes which are handled locally
  if (req.path.includes("/user/signin") || 
      req.path.includes("/user/signup") || 
      req.path.includes("/user/info")) {
    return next();
  }

  try {
    // Forward the request to the external API
    const response = await axios({
      method: req.method,
      url: `${EXTERNAL_API}${req.path}`,
      data: req.body,
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization
      },
      params: req.query
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