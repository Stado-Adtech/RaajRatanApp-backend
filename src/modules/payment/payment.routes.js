import express from "express";
import {
  createRazorpayPayment,
  verifyRazorpayPayment,
  getPaymentStatus,
  getMyPayments,
  recordFailedPayment
} from "./payment.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/razorpay/create", protect, createRazorpayPayment);
router.post("/razorpay/verify", protect, verifyRazorpayPayment);
router.get("/razorpay/status/:orderId", protect, getPaymentStatus);
router.get("/my", protect, getMyPayments); // ?enrollmentId= optional
router.post("/razorpay/failed", protect, recordFailedPayment);

export default router;