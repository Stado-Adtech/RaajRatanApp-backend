import Notification from "./notification.model.js";
import User from "../user/user.model.js";
import admin from "../../config/firebase.js";

export const createNotification = async ({
    userId,
    title,
    message,
    type = "general",
    data = {},
    sendPush = true,
}) => {
    const notification = await Notification.create({
        userId,
        title,
        message,
        type,
        data,
        isRead: false,
    });

    if (sendPush) {
        const user = await User.findById(userId).select("fcmToken");

        if (user?.fcmToken) {
            await sendFirebaseNotification({
                token: user.fcmToken,
                title,
                body: message,
                data: {
                    notificationId: notification._id.toString(),
                    type,
                    ...data,
                },
            });
        }
    }

    return notification;
};

export const sendFirebaseNotification = async ({
    token,
    title,
    body,
    data = {},
}) => {
    if (!token) return null;

    return admin.messaging().send({
        token,
        notification: {
            title,
            body,
        },
        data: Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, String(value)])
        ),
        android: {
            priority: "high",
            notification: {
                sound: "default",
                channelId: "default_channel",
            },
        },
    });
};

export const getUserNotifications = async (userId) => {
    return Notification.find({ userId }).sort({ createdAt: -1 });
};

export const markNotificationAsRead = async (userId, notificationId) => {
    return Notification.findOneAndUpdate(
        {
            _id: notificationId,
            userId,
        },
        {
            isRead: true,
        },
        {
            new: true,
        }
    );
};