import Tesseract from "tesseract.js";
import { parseReceipt } from "../utils/receiptParser.js";

export const scanReceiptController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Receipt image required",
      });
    }

    const result = await Tesseract.recognize(
      req.file.buffer,
      "eng",
      {
        logger: (m) => {
          console.log("OCR Progress:", m.status, m.progress);
        },
      }
    );

    const text = result.data.text || "";
    const confidence = result.data.confidence || 0;

    // ---------------- PARSE DATA ----------------
    const parsed = parseReceipt(text);

    return res.status(200).json({
      success: true,
      data: {
        ...parsed,
        rawText: text,
      },
      confidence,
    });
  } catch (error) {
    console.error("OCR ERROR:", error);
    next(error);
  }
};