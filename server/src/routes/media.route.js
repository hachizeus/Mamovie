import express from "express";
import { query, param } from "express-validator";
import mediaController from "../controllers/media.controller.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });

// Validate mediaType parameter
const validateMediaType = param("mediaType")
  .trim()
  .isIn(["movie", "tv"])
  .withMessage("mediaType must be 'movie' or 'tv'");

// GET /genres - MUST COME BEFORE /:mediaCategory
router.get(
  "/genres",
  validateMediaType,
  requestHandler.validate,
  mediaController.getGenres
);

// GET /search - MUST COME BEFORE /:mediaCategory
router.get(
  "/search",
  validateMediaType,
  query("query")
    .trim()
    .notEmpty().withMessage("query parameter is required")
    .isLength({ min: 1, max: 100 }).withMessage("query must be between 1-100 characters"),
  query("page")
    .optional()
    .toInt()
    .isInt({ min: 1, max: 1000 }).withMessage("page must be an integer between 1-1000"),
  requestHandler.validate,
  mediaController.search
);

// GET /detail/:mediaId - MUST COME BEFORE /:mediaCategory
router.get(
  "/detail/:mediaId",
  validateMediaType,
  param("mediaId")
    .trim()
    .isInt({ min: 1 }).withMessage("mediaId must be a positive integer"),
  requestHandler.validate,
  mediaController.getDetail
);

// GET /:mediaCategory - LAST (catch-all with category validation)
router.get(
  "/:mediaCategory",
  validateMediaType,
  param("mediaCategory")
    .trim()
    .isIn(["popular", "top_rated", "upcoming", "now_playing"])
    .withMessage("mediaCategory must be 'popular', 'top_rated', 'upcoming', or 'now_playing'"),
  query("page")
    .isInt({ min: 1, max: 1000 }).withMessage("page must be an integer between 1-1000")
    .optional(),
  requestHandler.validate,
  mediaController.getList
);

export default router;