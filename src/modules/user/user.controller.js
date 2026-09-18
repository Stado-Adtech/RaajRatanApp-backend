import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import User from "./user.model.js";
import {
  completeUserProfile,
  getAllUsers,
  getUserProfile,
} from "./user.service.js";

export const fetchMyProfile = asyncHandler(async (req, res) => {
  const data = await getUserProfile(req.user._id);

  return sendSuccess(res, "Profile fetched successfully", data, 200);
});

export const fetchUsers = asyncHandler(async (req, res) => {
  const data = await getAllUsers();

  return sendSuccess(res, "Users fetched successfully", data, 200);
});

export const completeProfile = asyncHandler(async (req, res) => {
  const data = await completeUserProfile(req.user._id, req.body);

  return sendSuccess(
    res,
    "Profile updated successfully",
    {
      user: data,
      nextScreen: req.user.role === "admin" ? "admin_dashboard" : "home",
    },
    200
  );
});

export const updateFcmToken = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { fcmToken } = req.body;

  if (!fcmToken) {
    return res.status(400).json({
      success: false,
      message: "FCM token is required",
    });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { fcmToken },
    { new: true }
  );

  return sendSuccess(res, "FCM token updated successfully", user, 200);
});