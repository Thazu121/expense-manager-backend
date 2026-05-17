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
      trim: true,
    },



    extractedText: {
      type: String,
      trim: true,
    },



    merchantName: {
      type: String,
      trim: true,
      maxlength: 100,
    },



    extractedAmount: {
      type: Number,
      min: 0,
    },



    extractedDate: {
      type: Date,
    },



    ocrStatus: {
      type: String,

      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
      ],

      default: "pending",
    },



    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
    },



    fileName: {
      type: String,
      trim: true,
    },

    fileSize: {
      type: Number,
      min: 0,
    },

    mimeType: {
      type: String,
      trim: true,
    },



    isVerified: {
      type: Boolean,
      default: false,
    },



    ocrProvider: {
      type: String,

      enum: [
        "tesseract",
        "google-vision",
        "aws-textract",
        "manual",
      ],

      default: "manual",
    },



    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },

  {
    timestamps: true,
  }
)



receiptSchema.index({
  userId: 1,
  createdAt: -1,
});


receiptSchema.index({
  expenseId: 1,
})


receiptSchema.index({
  ocrStatus: 1,
})


receiptSchema.index({
  merchantName: "text",
  extractedText: "text",
})


export const receiptModel =
  mongoose.model(
    "receipt",
    receiptSchema
  )