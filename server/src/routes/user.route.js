import express from "express";
import { body } from "express-validator";
import authController from "../controllers/auth.controller.js";
import requestHandler from "../handlers/request.handler.js";
import userModel from "../models/user.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post(
  "/signup",
  body("username")
    .exists().withMessage("username is required")
    .isLength({ min: 5 }).withMessage("username must be at least 5 characters")
    .custom(async value => {
      const user = await userModel.findOne({ username: value });
      if (user) return Promise.reject("username already used");
    }),
  body("password")
    .exists().withMessage("password is required")
    .isLength({ min: 8 }).withMessage("password minimum 8 characters"),
  body("confirmPassword")
    .exists().withMessage("confirmPassword is required")
    .isLength({ min: 8 }).withMessage("confirmPassword minimum 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("confirmPassword not match");
      return true;
    }),
  body("displayName")
    .exists().withMessage("displayName is required")
    .isLength({ min: 5, max: 8 }).withMessage("displayName must be between 5-8 characters"),
  body("phoneNumber")
    .exists().withMessage("phoneNumber is required"),
  requestHandler.validate,
  authController.signup
);

router.post(
  "/signin",
  body("username")
    .exists().withMessage("username is required")
    .isLength({ min: 5 }).withMessage("username must be at least 5 characters"),
  body("password")
    .exists().withMessage("password is required")
    .isLength({ min: 8 }).withMessage("password minimum 8 characters"),
  requestHandler.validate,
  authController.signin
);

router.get(
  "/info",
  tokenMiddleware.auth,
  authController.getInfo
);

export default router;