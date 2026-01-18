import express from "express";
import mpesaController from "../controllers/mpesa.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router({ mergeParams: true });

// Route to initiate M-Pesa payment
router.post(
  "/initiate",
  mpesaController.initiatePayment
);

// M-Pesa callback route
router.post(
  "/callback/:userId",
  mpesaController.mpesaCallback
);

// Check payment status
router.get(
  "/status/:checkoutRequestId",
  mpesaController.checkPaymentStatus
);

export default router;