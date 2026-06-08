import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js";
import { getNotifications } from "../controllers/notificationController.js";
import { clearNotifications } from "../controllers/notificationController.js";
import { markRead} from "../controllers/notificationController.js";
const notificationRoute = express.Router()

notificationRoute.get("/", authMiddleware, getNotifications);
notificationRoute.put("/read-all", authMiddleware, markRead);
notificationRoute.delete("/", authMiddleware, clearNotifications);
export default notificationRoute