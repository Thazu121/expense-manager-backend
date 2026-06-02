import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js";
import { getNotifications } from "../controllers/notificationController.js";
import { clearNotifications } from "../controllers/notificationController.js";
import { markAllRead } from "../controllers/notificationController.js";
const notificationRoute = express.Router()

notificationRoute.get("/", authMiddleware, getNotifications);
notificationRoute.put("/read-all", authMiddleware, markAllRead);
notificationRoute.delete("/", authMiddleware, clearNotifications);
export default notificationRoute