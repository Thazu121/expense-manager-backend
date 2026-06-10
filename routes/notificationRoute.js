import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";

import {
  getNotifications,
  markAsRead,
  markAllRead,
  deleteNotification,
  clearNotifications,
} from "../controllers/notificationController.js";

const notificationRoute =
  express.Router();

notificationRoute.use(
  authMiddleware
);

notificationRoute.get(
  "/",
  getNotifications
);

notificationRoute.put(
  "/read-all",
  markAllRead
);

notificationRoute.put(
  "/:id/read",
  markAsRead
);

notificationRoute.delete(
  "/clear",
  clearNotifications
);

notificationRoute.delete(
  "/:id",
  deleteNotification
);

export default notificationRoute;