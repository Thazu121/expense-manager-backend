import { notificationModel } from "../models/notificationModel.js";

export const sendNotification = async ({
  userId,
  title,
  message,
  type = "system",
  uniqueKey,
}) => {
  try {
    if (uniqueKey) {
      const existing = await notificationModel.findOne({
        userId,
        uniqueKey,
      });

      if (existing) return existing;
    }

    return await notificationModel.create({
      userId,
      title,
      message,
      type,
      uniqueKey,
    });
  } catch (err) {
    console.log("Notification Error:", err.message);
  }
}