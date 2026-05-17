import fs from "fs";

import { receiptModel }
from "../models/receiptModel.js";

import { expenseModel }
from "../models/expenseModel.js";



const uploadReceipt = async (
  req,
  res,
  next
) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Receipt image is required",
      });
    }

    const imageUrl =
      `${req.protocol}://${req.get(
        "host"
      )}/uploads/receipts/${
        req.file.filename
      }`

    const receipt =
      await receiptModel.create({
        userId: req.user.id,

        imageUrl,

        fileName:
          req.file.filename,

        fileSize:
          req.file.size,

        mimeType:
          req.file.mimetype,
      });

    return res.status(201).json({
      success: true,

      message:
        "Receipt uploaded successfully",

      receipt,
    });

  } catch (error) {
    next(error);
  }
};



const getReceipts = async (
  req,
  res,
  next
) => {
  try {

    const receipts =
      await receiptModel
        .find({
          userId: req.user.id,
        })
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count: receipts.length,

      receipts,
    });

  } catch (error) {
    next(error);
  }
};



const getSingleReceipt =
  async (req, res, next) => {
    try {

      const receipt =
        await receiptModel.findOne({
          _id: req.params.id,

          userId: req.user.id,
        });

      if (!receipt) {
        return res.status(404).json({
          success: false,

          message:
            "Receipt not found",
        });
      }

      return res.status(200).json({
        success: true,

        receipt,
      });

    } catch (error) {
      next(error);
    }
  };



const deleteReceipt =
  async (req, res, next) => {
    try {

      const receipt =
        await receiptModel.findOne({
          _id: req.params.id,

          userId: req.user.id,
        });

      if (!receipt) {
        return res.status(404).json({
          success: false,

          message:
            "Receipt not found",
        });
      }

      const filePath =
        `uploads/receipts/${receipt.fileName}`;

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await receipt.deleteOne();

      return res.status(200).json({
        success: true,

        message:
          "Receipt deleted successfully",
      });

    } catch (error) {
      next(error);
    }
  };



const linkReceiptToExpense =
  async (req, res, next) => {
    try {

      const {
        expenseId,
      } = req.body;

      const receipt =
        await receiptModel.findOne({
          _id: req.params.id,

          userId: req.user.id,
        });

      if (!receipt) {
        return res.status(404).json({
          success: false,

          message:
            "Receipt not found",
        });
      }

      const expense =
        await expenseModel.findOne({
          _id: expenseId,

          userId: req.user.id,
        });

      if (!expense) {
        return res.status(404).json({
          success: false,

          message:
            "Expense not found",
        });
      }

      receipt.expenseId =
        expense._id;

      await receipt.save();

      expense.receiptImage =
        receipt.imageUrl;

      await expense.save();

      return res.status(200).json({
        success: true,

        message:
          "Receipt linked successfully",

        receipt,
      });

    } catch (error) {
      next(error);
    }
  };



export {
  uploadReceipt,
  getReceipts,
  getSingleReceipt,
  deleteReceipt,
  linkReceiptToExpense,
};