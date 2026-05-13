import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "📁",
    },

    color: {
      type: String,
      default: "#6366f1",
    },
  },
  { timestamps: true }
)

export const categoryModel = mongoose.model(
  "category",
  categorySchema
)