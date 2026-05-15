import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/authController.js";

const authRoute = express.Router()

authRoute.post("/register", registerUser)

authRoute.post("/login", loginUser)

authRoute.get("/profile",getProfile)
authRoute.put("/profile",)
authRoute.put("/change-password")
authRoute.post("/logout")

export default authRoute