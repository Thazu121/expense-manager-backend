import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    merchant: {
      type: String,
      trim: true,
    },

    paymentMethod: {
      type: String,
      enum: [
        "cash",
        "card",
        "upi",
        "bank",
        "wallet",
      ],
      default: "cash",
    },

    notes: {
      type: String,
      maxlength: 500,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    expenseDate: {
      type: Date,
      default: Date.now,
    },

    receiptImage: {
      type: String,
    },

    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurringType: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
  },
  {
    timestamps: true,
  }
)

export const expenseModel = mongoose.model(
  "expense",
  expenseSchema
)