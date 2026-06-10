import { notificationModel } from "../models/notificationModel.js";

export const sendNotification =
  async ({
    userId,
    title,
    message,
    type = "system",
  }) => {
    try {
      await notificationModel.create({
        userId,
        title,
        message,
        type,
      });
    } catch (err) {
      console.log(
        "Notification Error:",
        err.message
      );
    }
  };