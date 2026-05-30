import { Worker } from "bullmq";
import { redis } from "../config/redis.js";

import Tesseract from "tesseract.js";
import sharp from "sharp";
import fetch from "node-fetch";

import { receiptModel } from "../models/receiptModel.js";

import {
  detectMerchant,
  detectDate,
  detectAmount,
  detectCategory,
} from "../utils/receiptParser.js";

export const ocrWorker =
  new Worker(
    "ocr-queue",

    async (job) => {
      const {
        receiptId,
        imageUrl,
      } = job.data;

      try {
        console.log(
          `Processing Receipt: ${receiptId}`
        );

        await receiptModel.findByIdAndUpdate(
          receiptId,
          {
            ocrStatus:
              "processing",
          }
        );

        const response =
          await fetch(imageUrl);

        if (!response.ok) {
          throw new Error(
            "Failed to download image"
          );
        }

        const imageBuffer =
          Buffer.from(
            await response.arrayBuffer()
          );

        const processedImage =
          await sharp(imageBuffer)
            .resize({
              width: 1500,
              withoutEnlargement:
                true,
            })
            .grayscale()
            .normalize()
            .sharpen()
            .png()
            .toBuffer();

        const result =
          await Tesseract.recognize(
            processedImage,
            "eng"
          );

        const text =
          result.data.text || "";

        const confidence =
          Math.round(
            result.data
              .confidence || 0
          );

        const extractedData = {
          merchant:
            detectMerchant(
              text
            ),

          date:
            detectDate(text),

          amount:
            detectAmount(text),

          category:
            detectCategory(
              text
            ),
        };

        await receiptModel.findByIdAndUpdate(
          receiptId,
          {
            ocrStatus:
              "completed",

            extractedText:
              text,

            ocrConfidence:
              confidence,

            extractedData,
          }
        );

        console.log(
          `OCR Completed: ${receiptId}`
        );

        return true;
      } catch (error) {
        console.error(
          "OCR Worker Error:",
          error
        );

        await receiptModel.findByIdAndUpdate(
          receiptId,
          {
            ocrStatus:
              "failed",
          }
        );

        throw error;
      }
    },

    {
      connection: redis,
      concurrency: 2,
    }
  );