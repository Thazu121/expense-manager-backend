import cloudinary from "../config/cloudinary.js";

import { receiptModel } from "../models/receiptModel.js";
import { expenseModel } from "../models/expenseModel.js";






export const uploadReceipt = async (
  req,
  res,
  next
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Receipt image is required",
      });
    }

    const receipt = await receiptModel.create({
      userId: req.user.id,

      imageUrl: req.file.path,

      publicId: req.file.filename,

      fileSize: req.file.size,

      mimeType: req.file.mimetype,

      ocrStatus: "uploaded",
    });

    return res.status(201).json({
      success: true,

      message: "Receipt uploaded successfully",

      receipt,
    });
  } catch (error) {
    next(error);
  }
};


export const getReceipts = async (
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

      count:
        receipts.length,

      receipts,
    });
  } catch (error) {
    next(error);
  }
};



export const getSingleReceipt = async (
  req,
  res,
  next
) => {
  try {
    const receipt =
      await receiptModel.findOne({
        _id: req.params.id,

        userId:
          req.user.id,
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



export const getReceiptStatus = async (
  req,
  res,
  next
) => {
  try {
    const receipt =
      await receiptModel.findOne({
        _id: req.params.id,

        userId:
          req.user.id,
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

      receiptId:
        receipt._id,

      status:
        receipt.ocrStatus,

      confidence:
        receipt.ocrConfidence,

      extractedData:
        receipt.extractedData,
    });
  } catch (error) {
    next(error);
  }
};



export const getReceiptResult = async (
  req,
  res,
  next
) => {
  try {
    const receipt =
      await receiptModel.findOne({
        _id: req.params.id,

        userId:
          req.user.id,
      });

    if (!receipt) {
      return res.status(404).json({
        success: false,

        message:
          "Receipt not found",
      });
    }

    if (
      receipt.ocrStatus !==
      "completed"
    ) {
      return res.status(200).json({
        success: true,

        completed: false,

        status:
          receipt.ocrStatus,
      });
    }

    return res.status(200).json({
      success: true,

      completed: true,

      confidence:
        receipt.ocrConfidence,

      extractedData:
        receipt.extractedData,
    });
  } catch (error) {
    next(error);
  }
};



export const verifyReceipt = async (
  req,
  res,
  next
) => {
  try {
    const receipt =
      await receiptModel.findOne({
        _id: req.params.id,

        userId:
          req.user.id,
      });

    if (!receipt) {
      return res.status(404).json({
        success: false,

        message:
          "Receipt not found",
      });
    }

    receipt.ocrStatus =
      "verified";

    await receipt.save();

    return res.status(200).json({
      success: true,

      message:
        "Receipt verified successfully",

      receipt,
    });
  } catch (error) {
    next(error);
  }
};



export const linkReceiptToExpense = async (
  req,
  res,
  next
) => {
  try {
    const {
      expenseId,
    } = req.body;

    const receipt =
      await receiptModel.findOne({
        _id: req.params.id,

        userId:
          req.user.id,
      });

    const expense =
      await expenseModel.findOne({
        _id: expenseId,

        userId:
          req.user.id,
      });

    if (
      !receipt ||
      !expense
    ) {
      return res.status(404).json({
        success: false,

        message:
          "Receipt or Expense not found",
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



export const deleteReceipt = async (
  req,
  res,
  next
) => {
  try {
    const receipt =
      await receiptModel.findOne({
        _id: req.params.id,

        userId:
          req.user.id,
      });

    if (!receipt) {
      return res.status(404).json({
        success: false,

        message:
          "Receipt not found",
      });
    }

    if (
      receipt.publicId
    ) {
      try {
        await cloudinary.uploader.destroy(
          receipt.publicId
        );
      } catch (err) {
        console.error(
          "Cloudinary delete failed:",
          err.message
        );
      }
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