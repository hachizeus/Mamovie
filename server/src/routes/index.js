import express from "express";
import userRoute from "./user.route.js";
import mediaRoute from "./media.route.js";
import personRoute from "./person.route.js";
import reviewRoute from "./review.route.js";

const router = express.Router();

// User routes FIRST (most specific)
router.use("/user", userRoute);

// Person and review routes (more specific)
router.use("/:mediaType/:mediaId/person", personRoute);
router.use("/:mediaType/:mediaId/reviews", reviewRoute);

// Media routes LAST (generic catch-all with params)
router.use("/:mediaType", mediaRoute);

export default router;

export default router;