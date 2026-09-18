import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import {
  createWalletTopupService,
  verifyWalletTopupService,
  getWalletBalanceService,
  getWalletTransactionsService,
} from "./wallet.service.js";

export const createWalletTopup = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const data = await createWalletTopupService({
    user: req.user,
    amount: Number(amount),
  });
  return sendSuccess(res, "Wallet top-up order created", data, 201);
});

export const verifyWalletTopup = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return sendError(
      res,
      "razorpayOrderId, razorpayPaymentId and razorpaySignature are required",
      400
    );
  }

  const data = await verifyWalletTopupService({
    user: req.user,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  return sendSuccess(res, "Wallet topped up successfully", data, 200);
});

export const getWalletBalance = asyncHandler(async (req, res) => {
  const data = await getWalletBalanceService({ userId: req.user._id });
  return sendSuccess(res, "Wallet balance fetched", data, 200);
});

export const getWalletTransactions = asyncHandler(async (req, res) => {
  const data = await getWalletTransactionsService({ userId: req.user._id });
  return sendSuccess(res, "Wallet transactions fetched", data, 200);
});