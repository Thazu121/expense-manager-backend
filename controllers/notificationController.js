import { notificationModel } from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
  const data = await notificationModel
    .find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.json({ success: true, data });
};

export const markRead = async (req, res) => {
  await notificationModel.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });

  res.json({ success: true });
};

export const clearAll = async (req, res) => {
  await notificationModel.deleteMany({ userId: req.user.id });
  res.json({ success: true });
};

export const clearNotifications = async (req, res) => {
  await notificationModel.deleteMany({ userId: req.user.id });

  res.json({ success: true });
};