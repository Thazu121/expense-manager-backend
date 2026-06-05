import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "expense",
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    cloudinaryId: {
      type: String,
    },

    merchantName: {
      type: String,
      trim: true,
    },

    extractedAmount: {
      type: Number,
      default: 0,
    },

    extractedDate: {
      type: Date,
    },

    extractedText: {
      type: String,
    },

    confidenceScore: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      default: "General",
    },

    ocrStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const receiptModel = mongoose.model(
  "receipt",
  receiptSchema
);