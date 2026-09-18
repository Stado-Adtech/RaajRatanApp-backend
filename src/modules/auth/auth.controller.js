import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { sendOtpService, verifyOtpService } from "./auth.service.js";

export const sendOtp = asyncHandler(async (req, res) => {
  const data = await sendOtpService(req.body);
  return sendSuccess(res, "OTP sent successfully", data, 200);
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const data = await verifyOtpService(req.body);
  return sendSuccess(res, "OTP verified successfully", data, 200);
});