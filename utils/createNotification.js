import { notificationModel } from "../models/notificationModel.js";

export const createNotification = async ({
  userId,
  title,
  message,
  type = "system",
}) => {
  return await notificationModel.create({
    userId,
    title,
    message,
    type,
    isRead: false,
  });
};