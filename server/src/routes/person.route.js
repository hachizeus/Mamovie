import express from "express";
import { param } from "express-validator";
import personController from "../controllers/person.controller.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });

// Validate personId parameter
const validatePersonId = param("personId")
  .trim()
  .isInt({ min: 1 }).withMessage("personId must be a positive integer");

router.get(
  "/:personId/medias",
  validatePersonId,
  requestHandler.validate,
  personController.personMedias
);

router.get(
  "/:personId",
  validatePersonId,
  requestHandler.validate,
  personController.personDetail
);

export default router;