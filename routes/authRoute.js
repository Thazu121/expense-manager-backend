import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
  // updateProfile,
  // changePassword,
  // logoutUser,
} from "../controllers/authController.js";

const authRoute = express.Router();

authRoute.post("/register", registerUser);

authRoute.post("/login", loginUser);

authRoute.get("/profile", getProfile);
// authRoute.put("/profile", updateProfile);

// authRoute.put("/change-password", changePassword);

// authRoute.post("/logout", logoutUser);

export default authRoute;