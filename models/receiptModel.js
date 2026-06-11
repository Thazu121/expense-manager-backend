import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "expense",
      default: null,
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    cloudinaryId: {
      type: String,
      default: "",
      trim: true,
    },

    merchantName: {
      type: String,
      trim: true,
      default: "Unknown",
    },

    extractedAmount: {
      type: Number,
      default: 0,
    },

    extractedDate: {
      type: Date,
      default: null,
    },

    extractedText: {
      type: String,
      default: "",
    },

    confidenceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    category: {
      type: String,
      default: "General",
      trim: true,
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

    source: {
      type: String,
      enum: ["camera", "upload", "ocr", "manual"],
      default: "ocr",
    },

    fileHash: {
      type: String,
      default: "",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

receiptSchema.index({
  userId: 1,
  createdAt: -1,
});

export const receiptModel = mongoose.model(
  "receipt",
  receiptSchema
);