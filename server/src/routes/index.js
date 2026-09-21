import express from "express";
import userRoute from "./user.route.js";
import mediaRoute from "./media.route.js";
import personRoute from "./person.route.js";
import reviewRoute from "./review.route.js";

const router = express.Router();

router.use("/user", userRoute);
router.use("/:mediaType", mediaRoute);
router.use("/:mediaType/:mediaId/person", personRoute);
router.use("/:mediaType/:mediaId/reviews", reviewRoute);

export default router;