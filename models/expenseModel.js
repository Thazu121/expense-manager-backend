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
      minlength: 2,
      maxlength: 100,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    merchant: {
      type: String,
      trim: true,
      maxlength: 100,
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
      trim: true,
    },



    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],



    expenseDate: {
      type: Date,
      default: Date.now,
    },



    receiptImage: {
      type: String,
    },



    favorite: {
      type: Boolean,
      default: false,
    },



    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurringType: {
      type: String,

      enum: [
        "daily",
        "weekly",
        "monthly",
        "yearly",
      ],
    },



    source: {
      type: String,

      enum: [
        "manual",
        "receipt-scan",
        "ocr",
      ],

      default: "manual",
    },
  },

  {
    timestamps: true,
  }
);



expenseSchema.index({
  userId: 1,
  expenseDate: -1,
})


expenseSchema.index({
  categoryId: 1,
})


expenseSchema.index({
  title: "text",
  notes: "text",
  merchant: "text",
})



export const expenseModel =
  mongoose.model(
    "expense",
    expenseSchema
  )