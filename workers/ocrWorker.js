import { Worker } from "bullmq";
import Tesseract from "tesseract.js";
import sharp from "sharp";
import axios from "axios";
import { receiptModel } from "../models/receiptModel.js";
import { parseReceipt } from "../utils/receiptParser.js";
import { redis } from "../config/redis.js";

export const ocrWorker = new Worker(
  "ocr-queue",
  async (job) => {
    const { receiptId, imageUrl } = job.data;

    try {
      // 1. mark processing
      await receiptModel.findByIdAndUpdate(receiptId, {
        ocrStatus: "processing",
      });

      // 2. download image
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });

      const buffer = Buffer.from(response.data);

      // 3. preprocess image
      const processedImage = await sharp(buffer)
        .resize({ width: 1800 })
        .grayscale()
        .normalize()
        .toBuffer();

      // 4. OCR
      const result = await Tesseract.recognize(processedImage, "eng");

      const text = result.data.text || "";
      const confidence = Math.round(result.data.confidence || 0);

      // 5. parse receipt
      const parsed = parseReceipt(text);

      // 6. SAVE TO DATABASE (THIS WAS MISSING)
      await receiptModel.findByIdAndUpdate(receiptId, {
        merchantName: parsed.merchant || "Unknown",
        extractedAmount: parsed.amount || 0,
        extractedDate: parsed.date || null,
        extractedText: text,
        confidenceScore: confidence,
        ocrStatus: "completed",
      });

    } catch (err) {
      console.error("OCR Worker Error:", err);

      await receiptModel.findByIdAndUpdate(receiptId, {
        ocrStatus: "failed",
      });
    }
  },
  {
    connection: redis,
  }
);