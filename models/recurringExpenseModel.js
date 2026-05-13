import mongoose from "mongoose";

const recurringExpenseSchema =
  new mongoose.Schema(
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

      frequency: {
        type: String,
        enum: [
          "daily",
          "weekly",
          "monthly",
          "yearly",
        ],
        required: true,
      },

      nextRunDate: {
        type: Date,
        required: true,
      },

      lastRunDate: {
        type: Date,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  )

export const recurringExpenseModel =
  mongoose.model(
    "recurringExpense",
    recurringExpenseSchema
  )