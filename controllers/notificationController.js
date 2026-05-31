import { notificationModel } from "../models/notificationModel.js";

// GET ALL
export const getNotifications = async (req, res) => {
  const notifications = await notificationModel
    .find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.json({ success: true, notifications });
};

// MARK ALL READ
export const markAllRead = async (req, res) => {
  await notificationModel.updateMany(
    { userId: req.user.id },
    { isRead: true }
  );

  res.json({ success: true });
};

// CLEAR
export const clearNotifications = async (req, res) => {
  await notificationModel.deleteMany({ userId: req.user.id });

  res.json({ success: true });
};