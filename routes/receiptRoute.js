import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

import {
  uploadReceipt,
  updateReceipt,
  getReceipts,
  getSingleReceipt,
  getReceiptStatus,
  deleteReceipt,
  linkReceiptToExpense,
  verifyReceipt,
} from "../controllers/receiptController.js";

const receiptRoute = express.Router();

receiptRoute.post(
  "/upload",
  authMiddleware,
  upload.single("receipt"),
  uploadReceipt
);


receiptRoute.get(
  "/",
  authMiddleware,
  getReceipts
);


receiptRoute.get(
  "/:id",
  authMiddleware,
  getSingleReceipt
);


receiptRoute.get(
  "/:id/status",
  authMiddleware,
  getReceiptStatus
);


receiptRoute.put(
  "/:id/link-expense",
  authMiddleware,
  linkReceiptToExpense
);


receiptRoute.put(
  "/:id/verify",
  authMiddleware,
  verifyReceipt
);


receiptRoute.delete(
  "/:id",
  authMiddleware,
  deleteReceipt
)
receiptRoute.put("/:id", authMiddleware, updateReceipt);

export default receiptRoute;