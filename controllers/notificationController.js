import { notificationModel } from "../models/notificationModel.js";

export const getNotifications =
  async (req, res, next) => {
    try {
      const notifications =
        await notificationModel
          .find({
            userId: req.user.id,
          })
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        notifications,
      });
    } catch (err) {
      next(err);
    }
  };

export const markAsRead =
  async (req, res, next) => {
    try {
      const notification =
        await notificationModel.findOneAndUpdate(
          {
            _id: req.params.id,
            userId: req.user.id,
          },
          {
            read: true,
          },
          {
            new: true,
          }
        );

      res.json({
        success: true,
        notification,
      });
    } catch (err) {
      next(err);
    }
  };

export const markAllRead =
  async (req, res, next) => {
    try {
      await notificationModel.updateMany(
        {
          userId: req.user.id,
        },
        {
          read: true,
        }
      );

      res.json({
        success: true,
      });
    } catch (err) {
      next(err);
    }
  };

export const deleteNotification =
  async (req, res, next) => {
    try {
      await notificationModel.deleteOne({
        _id: req.params.id,
        userId: req.user.id,
      });

      res.json({
        success: true,
      });
    } catch (err) {
      next(err);
    }
  };

export const clearNotifications =
  async (req, res, next) => {
    try {
      await notificationModel.deleteMany({
        userId: req.user.id,
      });

      res.json({
        success: true,
      });
    } catch (err) {
      next(err);
    }
  };