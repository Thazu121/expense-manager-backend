import express from "express"

const notificationRoute = express.Router()

notificationRoute.get("/", authMiddleware, getNotifications);
notificationRoute.put("/read-all", authMiddleware, markAllRead);
notificationRoute.delete("/", authMiddleware, clearNotifications);
export default notificationRoute