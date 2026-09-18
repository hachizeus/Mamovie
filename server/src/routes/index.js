import express from "express";
import userRoute from "./user.route.js";
import mediaRoute from "./media.route.js";
import personRoute from "./person.route.js";
import reviewRoute from "./review.route.js";

const router = express.Router();

// User routes FIRST (most specific)
router.use("/user", userRoute);

// Media routes - these are generic/:mediaType paths and must come EARLY
// because anything else matching /:mediaType will fall through to here
router.use("/:mediaType", mediaRoute);

// Person and review routes (more specific - only match when path has right structure)
router.use("/:mediaType/:mediaId/person", personRoute);
router.use("/:mediaType/:mediaId/reviews", reviewRoute);

export default router;