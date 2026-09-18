import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import {
  createRazorpayPaymentService,
  verifyRazorpayPaymentService,
  getPaymentStatusService,
  getMyPaymentsService,
  recordFailedPaymentService,
} from "./payment.service.js";

export const createRazorpayPayment = asyncHandler(async (req, res) => {
  const user = req.user;
  const { enrollmentId, installmentId, amount } = req.body;

  if (!enrollmentId || !installmentId) {
    return sendError(res, "enrollmentId and installmentId are required", 400);
  }

  const data = await createRazorpayPaymentService({
    user,
    enrollmentId,
    installmentId,
    amount,
  });

  return sendSuccess(res, "Payment order created successfully", data, 201);
});

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const user = req.user;
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return sendError(
      res,
      "razorpayOrderId, razorpayPaymentId and razorpaySignature are required",
      400
    );
  }

  const data = await verifyRazorpayPaymentService({
    user,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  return sendSuccess(res, "Payment verified successfully", data, 200);
});

export const getPaymentStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  if (!orderId) {
    return sendError(res, "orderId is required", 400);
  }

  const data = await getPaymentStatusService({ orderId, userId });
  return sendSuccess(res, "Payment status fetched", data, 200);
});

export const getMyPayments = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { enrollmentId } = req.query; // optional ?enrollmentId=xxx

  const data = await getMyPaymentsService({ userId, enrollmentId });
  return sendSuccess(res, "Payments fetched", data, 200);
});

export const recordFailedPayment = asyncHandler(async (req, res) => {
  const { orderId, reason } = req.body;

  if (!orderId) {
    return sendError(res, "orderId is required", 400);
  }

  const data = await recordFailedPaymentService({ user: req.user, orderId, reason });
  return sendSuccess(res, "Payment failure recorded", data, 200);
});