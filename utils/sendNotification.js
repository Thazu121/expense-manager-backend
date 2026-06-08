import { io } from "../index.js";

export const sendNotification = async ({
  userId,
  title,
  message,
}) => {
  try {
    io.to(userId.toString()).emit("notification:new", {
  id: notification._id,
  title,
  message,
  type: "info",
  read: false,
  createdAt: new Date().toISOString(),
});
  } catch (err) {
    console.log("Socket notification error:", err.message);
  }
};