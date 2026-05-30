import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import { scanReceiptController } from "../controllers/scanController.js";

const Scanrouter = express.Router();

Scanrouter.post(
  "/receipt",
  upload.single("receipt"),
  scanReceiptController
);

export default Scanrouter;