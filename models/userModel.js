import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please use a valid email",
      ],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    photo: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    currency: {
      type: String,
      default: "INR",
    },

    darkMode: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model(
  "users",
  userSchema
);
