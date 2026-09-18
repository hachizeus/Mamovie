import express from "express";
import { query, param, validationResult } from "express-validator";
import mediaController from "../controllers/media.controller.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });

// Middleware to sanitize and validate mediaType
const validateMediaType = (req, res, next) => {
  // Sanitize mediaType
  let mediaType = String(req.params.mediaType || "").toLowerCase().trim();
  
  // Validate it's a valid type
  if (!["movie", "tv"].includes(mediaType)) {
    return requestHandler.badRequest(res, "mediaType must be 'movie' or 'tv'");
  }
  
  // Replace the param with sanitized version
  req.params.mediaType = mediaType;
  next();
};

// GET /genres
router.get(
  "/genres",
  validateMediaType,
  requestHandler.validate,
  mediaController.getGenres
);

// GET /search
router.get(
  "/search",
  validateMediaType,
  query("query")
    .trim()
    .optional()
    .isLength({ min: 1, max: 100 }).withMessage("query must be between 1-100 characters"),
  query("page")
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage("page must be an integer between 1-1000"),
  requestHandler.validate,
  mediaController.search
);

// GET /detail/:mediaId
router.get(
  "/detail/:mediaId",
  validateMediaType,
  requestHandler.validate,
  mediaController.getDetail
);

// GET /:mediaCategory
router.get(
  "/:mediaCategory",
  validateMediaType,
  query("page")
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage("page must be an integer between 1-1000"),
  requestHandler.validate,
  mediaController.getList
);

export default router;