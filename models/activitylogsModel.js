import mongoose from "mongoose";

const activityLogSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },

      action: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  )

export const activityLogModel =
  mongoose.model(
    "activityLog",
    activityLogSchema
  )