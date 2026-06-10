import { Worker } from "bullmq";
import Tesseract from "tesseract.js";
import sharp from "sharp";
import axios from "axios";

import { receiptModel } from "../models/receiptModel.js";
import { parseReceipt } from "../utils/receiptParser.js";
import { redis } from "../config/redis.js";
import { sendNotification } from "../utils/sendNotification.js";

const parseReceiptDate = (dateString) => {
  if (!dateString) return null;

  try {
    const directDate = new Date(dateString);

    if (!isNaN(directDate.getTime())) {
      return directDate;
    }

    const match = dateString.match(
      /^(\d{2})[\/.-](\d{2})[\/.-](\d{2,4})$/
    );

    if (match) {
      let [, day, month, year] = match;

      if (year.length === 2) {
        year = `20${year}`;
      }

      const convertedDate = new Date(
        `${year}-${month}-${day}`
      );

      if (!isNaN(convertedDate.getTime())) {
        return convertedDate;
      }
    }

    return null;
  } catch {
    return null;
  }
};

export const ocrWorker = new Worker(
  "ocr-queue",

  async (job) => {
    const { receiptId, imageUrl } = job.data;

    try {
      await receiptModel.findByIdAndUpdate(receiptId, {
        ocrStatus: "processing",
      });

      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });

      const buffer = Buffer.from(response.data);

      const processedImage = await sharp(buffer)
        .resize({
          width: 1800,
          withoutEnlargement: true,
        })
        .grayscale()
        .normalize()
        .sharpen()
        .toBuffer();

      const result = await Tesseract.recognize(
        processedImage,
        "eng"
      );

      const text = result.data.text || "";

      const confidence = Math.round(
        result.data.confidence || 0
      );

      const parsed = parseReceipt(text);

      const extractedDate = parseReceiptDate(
        parsed.date
      );

      const receipt =
        await receiptModel.findByIdAndUpdate(
          receiptId,
          {
            merchantName:
              parsed.merchant || "Unknown",

            extractedAmount:
              Number(parsed.amount) || 0,

            extractedDate,

            category:
              parsed.category || "General",

            extractedText: text,

            confidenceScore: confidence,

            ocrStatus: "completed",
          },
          {
            new: true,
          }
        );

      if (receipt) {
        await sendNotification({
          userId: receipt.userId,
          title: "Receipt Scanned",
          message: `${
            receipt.merchantName || "Receipt"
          } scanned successfully`,
          type: "receipt",
        });
      }

      console.log(
        `OCR completed for receipt ${receiptId}`
      );
    } catch (err) {
      console.error("OCR Worker Error:", err);

      const failedReceipt =
        await receiptModel.findByIdAndUpdate(
          receiptId,
          {
            ocrStatus: "failed",
          },
          {
            new: true,
          }
        );

      if (failedReceipt) {
        await sendNotification({
          userId: failedReceipt.userId,
          title: "Receipt Scan Failed",
          message: "Could not scan your receipt. Please try again.",
          type: "receipt",
        });
      }
    }
  },

  {
    connection: redis,
  }
);