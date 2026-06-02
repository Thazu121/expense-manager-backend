import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const existingUser =
      await userModel.findOne({
        email,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await userModel.create({
        name,
        email,
        password:
          hashedPassword,
      });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      message:
        "Registered successfully",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const loginUser = async (
  req,
  res,
  next
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await userModel.findOne({
        email,
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const match =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!match) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message:
        "Login successful",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// PROFILE
export const getProfile =
  async (
    req,
    res,
    next
  ) => {
    try {
      const user =
        await userModel
          .findById(
            req.user.id
          )
          .select(
            "-password"
          );

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  };

// UPDATE USERNAME
export const updateUsername =
  async (
    req,
    res,
    next
  ) => {
    try {
      const { name } =
        req.body;

      const user =
        await userModel
          .findByIdAndUpdate(
            req.user.id,
            { name },
            { new: true }
          )
          .select(
            "-password"
          );

      res.status(200).json({
        success: true,
        message:
          "Username updated",
        user,
      });
    } catch (error) {
      next(error);
    }
  };

// CHANGE PASSWORD
export const changePassword =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      const user =
        await userModel.findById(
          req.user.id
        );

      const match =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!match) {
        return res.status(400).json({
          success: false,
          message:
            "Current password incorrect",
        });
      }

      user.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  };

// FORGOT PASSWORD
export const forgotPassword =
  async (
    req,
    res,
    next
  ) => {
    try {
      const { email } =
        req.body;

      const user =
        await userModel.findOne({
          email,
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      const otp =
        Math.floor(
          100000 +
            Math.random() *
              900000
        ).toString();

      user.resetCode =
        otp;

      user.resetCodeExpire =
        Date.now() +
        10 * 60 * 1000;

      await user.save();

      console.log(
        "Password Reset OTP:",
        otp
      );

      res.status(200).json({
        success: true,
        message:
          "OTP sent successfully",
      });
    } catch (error) {
      next(error);
    }
  };

// RESET PASSWORD
export const resetPassword =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        email,
        code,
        newPassword,
      } = req.body;

      const user =
        await userModel.findOne({
          email,
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      if (
        user.resetCode !==
          code ||
        user.resetCodeExpire <
          Date.now()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid or expired OTP",
        });
      }

      user.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.resetCode =
        undefined;

      user.resetCodeExpire =
        undefined;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Password reset successfully",
      });
    } catch (error) {
      next(error);
    }
  };

// DELETE ACCOUNT
export const deleteAccount =
  async (
    req,
    res,
    next
  ) => {
    try {
      await userModel.findByIdAndDelete(
        req.user.id
      );

      res.status(200).json({
        success: true,
        message:
          "Account deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

// PROFILE PHOTO
export const updateProfilePhoto =
  async (
    req,
    res,
    next
  ) => {
    try {
      const user =
        await userModel
          .findByIdAndUpdate(
            req.user.id,
            {
              profileImage:
                req.file.path,
            },
            {
              new: true,
            }
          )
          .select(
            "-password"
          );

      res.status(200).json({
        success: true,
        message:
          "Profile updated",
        user,
      });
    } catch (error) {
      next(error);
    }
  };