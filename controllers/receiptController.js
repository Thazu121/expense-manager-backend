import fs from "fs";
import Tesseract from "tesseract.js";
import sharp from "sharp";

import { receiptModel } from "../models/receiptModel.js";
import { expenseModel } from "../models/expenseModel.js";

export const uploadReceipt = async (req, res, next) => {
  let receipt;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Receipt image is required",
      });
    }

    const imageUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/receipts/${req.file.filename}`;

    // 1. Create receipt (processing state)
    receipt = await receiptModel.create({
      userId: req.user.id,
      imageUrl,
      fileName: req.file.filename,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      ocrStatus: "processing",
      ocrProvider: "tesseract",
    });

    // 2. Read image safely
    const buffer = fs.readFileSync(req.file.path);

    // 3. Image preprocessing (IMPORTANT for OCR accuracy)
    const processedImage = await sharp(buffer)
      .resize({ width: 1500 })
      .grayscale()
      .normalize()
      .sharpen()
      .toBuffer();

    // 4. OCR processing
    let text = "";
    let confidence = 0;

    try {
      const result = await Tesseract.recognize(
        processedImage,
        "eng"
      );

      text = result.data.text;
      confidence = result.data.confidence;
    } catch (ocrError) {
      await receiptModel.findByIdAndUpdate(receipt._id, {
        ocrStatus: "failed",
      });

      return res.status(500).json({
        success: false,
        message: "OCR processing failed",
      });
    }

    // 5. Extract structured data
    const parsed = extractReceiptData(text);

    // 6. Update receipt in DB
    receipt = await receiptModel.findByIdAndUpdate(
      receipt._id,
      {
        extractedText: text,
        confidenceScore: Math.round(confidence),
        merchantName: parsed.merchant,
        extractedAmount: parsed.amount,
        extractedDate: parsed.date,
        ocrStatus: "completed",
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Receipt uploaded and processed successfully",
      receipt,
    });
  } catch (error) {
    if (receipt) {
      await receiptModel.findByIdAndUpdate(receipt._id, {
        ocrStatus: "failed",
      });
    }

    next(error);
  }
}



function extractReceiptData(text) {
  const cleanText = text.replace(/\s+/g, " ");

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Merchant (first readable line)
  const merchant = lines[0] || "";

  // Date detection
  const dateMatch = cleanText.match(
    /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/
  );

  // Amount detection
  const amountMatch = cleanText
    .replace(/,/g, "")
    .match(/\d+\.\d{2}/g);

  const amount = amountMatch
    ? parseFloat(amountMatch.pop())
    : null;

  return {
    merchant,
    date: dateMatch ? new Date(dateMatch[0]) : null,
    amount,
  };
}

export const getReceipts = async (req, res, next) => {
  try {
    const receipts = await receiptModel
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: receipts.length,
      receipts,
    });
  } catch (error) {
    next(error);
  }
}



export const getSingleReceipt = async (req, res, next) => {
  try {
    const receipt = await receiptModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found",
      });
    }

    res.json({
      success: true,
      receipt,
    });
  } catch (error) {
    next(error);
  }
}



export const deleteReceipt = async (req, res, next) => {
  try {
    const receipt = await receiptModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found",
      });
    }

    // delete file
    if (fs.existsSync(req.file?.path)) {
      fs.unlinkSync(req.file.path);
    }

    await receipt.deleteOne();

    res.json({
      success: true,
      message: "Receipt deleted",
    });
  } catch (error) {
    next(error);
  }
}


export const linkReceiptToExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.body;

    const receipt = await receiptModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    const expense = await expenseModel.findOne({
      _id: expenseId,
      userId: req.user.id,
    });

    if (!receipt || !expense) {
      return res.status(404).json({
        success: false,
        message: "Receipt or Expense not found",
      });
    }

    receipt.expenseId = expense._id;
    await receipt.save();

    expense.receiptImage = receipt.imageUrl;
    await expense.save();

    res.json({
      success: true,
      message: "Receipt linked successfully",
      receipt,
    });
  } catch (error) {
    next(error);
  }
}

