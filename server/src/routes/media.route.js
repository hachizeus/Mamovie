import express from "express";
import mediaController from "../controllers/media.controller.js";

const router = express.Router({ mergeParams: true });

// More specific routes FIRST, generic routes LAST
router.get("/search", mediaController.search);
router.get("/genres", mediaController.getGenres);
router.get("/detail/:mediaId", mediaController.getDetail);
router.get("/:mediaCategory", mediaController.getList);

// Direct ID fallback - for requests like /movie/969681 (without /detail prefix)
router.get("/:mediaId", (req, res, next) => {
  const { mediaId } = req.params;
  // If it looks like a numeric ID, treat it as detail request
  if (/^\d+$/.test(mediaId)) {
    req.params.mediaId = mediaId;
    return mediaController.getDetail(req, res);
  }
  next();
});

export default router;