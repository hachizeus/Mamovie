import express from "express";
import mediaController from "../controllers/media.controller.js";

const router = express.Router({ mergeParams: true });

// GET /genres
router.get(
  "/genres",
  mediaController.getGenres
);

// GET /search
router.get(
  "/search",
  mediaController.search
);

// GET /detail/:mediaId
router.get(
  "/detail/:mediaId",
  mediaController.getDetail
);

// GET /:mediaCategory - catch-all for lists
router.get(
  "/:mediaCategory",
  mediaController.getList
);

export default router;