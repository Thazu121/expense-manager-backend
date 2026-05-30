import Tesseract from "tesseract.js";

export const scanReceiptController = async (
  req,
  res,
  next
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Receipt image required",
      });
    }

    const result =
      await Tesseract.recognize(
        req.file.path,
        "eng"
      );

    const text = result.data.text;

    res.status(200).json({
      success: true,
      data: {
        merchant: text.split("\n")[0],
        rawText: text,
        confidence:
          result.data.confidence,
      },
    });
  } catch (error) {
    next(error);
  }
};