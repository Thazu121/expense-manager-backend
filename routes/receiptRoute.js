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

/* =========================
   CREATE - Upload Receipt
========================= */
receiptRoute.post(
  "/upload",
  authMiddleware,
  upload.single("receipt"),
  uploadReceipt
);

/* =========================
   READ - Get All Receipts
========================= */
receiptRoute.get(
  "/",
  authMiddleware,
  getReceipts
);

/* =========================
   READ - Single Receipt
========================= */
receiptRoute.get(
  "/:id",
  authMiddleware,
  getSingleReceipt
);

/* =========================
   READ - Receipt Status (OCR)
========================= */
receiptRoute.get(
  "/:id/status",
  authMiddleware,
  getReceiptStatus
);

/* =========================
   UPDATE - Link to Expense
========================= */
receiptRoute.put(
  "/:id/link-expense",
  authMiddleware,
  linkReceiptToExpense
);

/* =========================
   UPDATE - Verify Receipt
========================= */
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