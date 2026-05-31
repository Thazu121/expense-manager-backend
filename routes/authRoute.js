import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
  updateUsername,
  changePassword,
  deleteAccount,
  updateProfilePhoto,
} from "../controllers/authController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const authRoute = express.Router();


authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);


authRoute.get("/profile", authMiddleware, getProfile)

authRoute.put("/profile", authMiddleware, updateUsername)

authRoute.put("/change-password", authMiddleware, changePassword)

authRoute.put("/profile-photo", authMiddleware, updateProfilePhoto)

authRoute.delete("/delete-account", authMiddleware, deleteAccount)

export default authRoute