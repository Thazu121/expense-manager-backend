import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    extractedText: {
      type: String,
      required: true,
    },

    merchantName: {
      type: String,
      trim: true,
    },

    extractedAmount: {
      type: Number,
    },

    extractedDate: {
      type: Date,
    },

    ocrStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
)

export const receiptModel = mongoose.model(
  "receipt",
  receiptSchema
)