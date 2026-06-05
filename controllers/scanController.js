import sharp from "sharp";
import Tesseract from "tesseract.js";
import { parseReceipt } from "../utils/receiptParser.js";
import { receiptModel } from "../models/receiptModel.js";
import mongoose from "mongoose";

export const scanReceiptController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Receipt image required",
      });
    }

    const imageInput = req.file.buffer || req.file.path;

    const processedImage = await sharp(imageInput)
      .resize({ width: 1800, withoutEnlargement: true })
      .grayscale()
      .normalize()
      .sharpen()
      .png()
      .toBuffer();

    const result = await Tesseract.recognize(processedImage, "eng");

    const text = result.data.text || "";
    const confidence = Math.round(result.data.confidence || 0);

    const parsed = parseReceipt(text);

    const receipt = await receiptModel.findByIdAndUpdate(
      req.body.receiptId, 
      {
        extractedText: text,
        merchantName: parsed.merchant || "Unknown",
        extractedAmount: parsed.amount || 0,
        extractedDate: parsed.date || null,
        confidenceScore: confidence,
        ocrStatus: "completed",
      },
      { returnDocument: "after" }
    );

    return res.status(200).json({
      success: true,
      receiptId: receipt?._id,
      confidence,
      data: {
        merchant: parsed.merchant || "Unknown",
        amount: parsed.amount || 0,
        date: parsed.date || "",
        category: parsed.category || "General",
        rawText: text,
      },
    });
  } catch (error) {
    next(error);
  }
};