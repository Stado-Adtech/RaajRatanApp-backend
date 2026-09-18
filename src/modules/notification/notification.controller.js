import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import {
    getUserNotifications,
    markNotificationAsRead,
} from "./notification.service.js";

export const getMyNotifications = asyncHandler(async (req, res) => {
    const userId = req.user?._id || req.user?.id;

    const data = await getUserNotifications(userId);

    return sendSuccess(res, "Notifications fetched successfully", data, 200);
});

export const readNotification = asyncHandler(async (req, res) => {
    const userId = req.user?._id || req.user?.id;

    const data = await markNotificationAsRead(userId, req.params.id);

    return sendSuccess(res, "Notification marked as read", data, 200);
});