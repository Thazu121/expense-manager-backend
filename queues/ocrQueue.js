import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

export const ocrQueue = new Queue("ocr-queue", {
  connection: redis,
});