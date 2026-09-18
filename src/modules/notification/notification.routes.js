import express from "express";
import {
    getMyNotifications,
    readNotification,
} from "./notification.controller.js";

import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/my", protect, getMyNotifications);
router.patch("/:id/read", protect, readNotification);

export default router;