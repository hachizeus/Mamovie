import express from "express";
import { query } from "express-validator";
import mediaController from "../controllers/media.controller.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });

// GET /genres
router.get(
  "/genres",
  mediaController.getGenres
);

// GET /search
router.get(
  "/search",
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
  mediaController.getDetail
);

// GET /:mediaCategory
router.get(
  "/:mediaCategory",
  query("page")
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage("page must be an integer between 1-1000"),
  requestHandler.validate,
  mediaController.getList
);

export default router;