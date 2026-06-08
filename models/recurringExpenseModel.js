import mongoose from "mongoose";

const recurringExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
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

    category: {
      type: String,
      default: "General",
      trim: true,
    },

    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "monthly",
    },

    nextDueDate: {
      type: Date,
      required: true,
    },

    note: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastGeneratedDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const recurringExpenseModel = mongoose.model(
  "recurringExpense",
  recurringExpenseSchema
);