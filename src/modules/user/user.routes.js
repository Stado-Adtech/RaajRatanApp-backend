import express from "express";
import { fetchMyProfile, fetchUsers, completeProfile, updateFcmToken } from "./user.controller.js";
import { adminOnly, protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", protect, fetchMyProfile);
router.get("/", protect, adminOnly, fetchUsers);
router.patch("/complete-profile", protect, completeProfile);
router.patch("/fcm-token", protect, updateFcmToken);

export default router;