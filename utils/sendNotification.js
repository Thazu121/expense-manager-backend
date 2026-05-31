import { io } from "../server.js";
import { notificationModel } from "../models/notificationModel.js";

export const sendNotification = async ({
  userId,
  title,
  message,
}) => {
  const notification = await notificationModel.create({
    userId,
    title,
    message,
  });

  io.to(userId).emit("notification", notification);

  return notification;
};