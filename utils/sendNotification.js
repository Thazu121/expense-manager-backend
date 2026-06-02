import { notificationModel } from "../models/notificationModel.js";
import { io } from "../index.js";

export const sendNotification = async ({
  userId,
  title,
  message,
}) => {
  try {
    const notification = await notificationModel.create({
      userId,
      title,
      message,
    });

    io.to(userId).emit("notification", notification);

    return notification;
  } catch (error) {
    console.log("Notification Error:", error.message);
  }
};