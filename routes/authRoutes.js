import express from "express";

import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";

const authRouter = express.Router()

authRouter.post("/register", registerUser)

authRouter.post("/login", loginUser)

authRouter.get("/profile",)
authRouter.put("profile",)
authRouter.put("/change-password")
authRouter.post("/logout")

export default authRouter