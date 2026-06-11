import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { scanReceiptController } from "../controllers/scanController.js";

const scanRouter = express.Router();

scanRouter.post(
  "/receipt",
  authMiddleware,
  upload.single("receipt"),
  scanReceiptController
);

export default scanRouter;