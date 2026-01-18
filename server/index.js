import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import "dotenv/config";
import routes from "./src/routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./src/mongoose/index.js";
import fetch from "node-fetch";

const app = express();

// -------------------- PATH SETUP --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- CORS (SAFE + CORRECT) --------------------
app.use(
  cors({
    origin: [
      "https://mamovie-frontend.onrender.com",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// Handle preflight requests
app.options("*", cors());

// -------------------- MIDDLEWARE --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// -------------------- DATABASE --------------------
connectDB();

// -------------------- AUTH / INTERNAL ROUTES --------------------
app.use("/api/v1", routes);

// -------------------- EXTERNAL API PROXY --------------------
app.use("/api/v1/proxy", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL required" });
    
    const response = await fetch(url);
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy failed" });
  }
});

// -------------------- TMDB API PROXY --------------------
app.use("/api/v1", async (req, res, next) => {
  try {
    const tmdbBaseUrl = "https://api.themoviedb.org/3";
    const targetUrl = tmdbBaseUrl + req.originalUrl.replace("/api/v1", "");

    const response = await fetch(targetUrl, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// -------------------- HEALTH CHECK --------------------
app.get("/", (req, res) => {
  res.json({ message: "Mamovie API is running!" });
});

// -------------------- SERVER --------------------
const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
