import express from "express";

import authMiddleware
from "../middlewares/authMiddleware.js";

import upload
from "../middlewares/uploadMiddleware.js";

import {
  uploadReceipt,
  getReceipts,
  getSingleReceipt,
  deleteReceipt,
  linkReceiptToExpense,
} from "../controllers/receiptController.js";


const receiptRoute =
  express.Router()



receiptRoute.post(
  "/upload",

  authMiddleware,

  upload.single("receipt"),

  uploadReceipt
)



receiptRoute.get(
  "/",

  authMiddleware,

  getReceipts
)



receiptRoute.get(
  "/gallery",

  authMiddleware,

  getReceipts
)



receiptRoute.get(
  "/:id",

  authMiddleware,

  getSingleReceipt
)



receiptRoute.delete(
  "/:id",

  authMiddleware,

  deleteReceipt
)



receiptRoute.put(
  "/:id/link-expense",

  authMiddleware,

  linkReceiptToExpense
)



export default receiptRoute