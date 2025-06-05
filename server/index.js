import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import "dotenv/config";
import routes from "./src/routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./src/mongoose/index.js";
import proxyMiddleware from "./src/middlewares/proxy.middleware.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for all routes
app.use(cors({
  origin: '*',  // Allow all origins temporarily for debugging
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Connect to MongoDB for authentication data
connectDB();

// API routes with proxy middleware for non-auth routes
app.use("/api/v1", proxyMiddleware, routes);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist")));

// For any other routes, serve the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});