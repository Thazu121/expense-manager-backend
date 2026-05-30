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

    const result = await Tesseract.recognize(
      req.file.path,
      "eng"
    );

    const text = result.data.text;
    const confidence = result.data.confidence;

    const merchant = detectMerchant(text);
    const amount = detectAmount(text);
    const date = detectDate(text);
    const category = detectCategory(text);

    return res.status(200).json({
      success: true,
      data: {
        merchant,
        amount,
        date,
        category,
        rawText: text,
      },
      confidence,
    });
  } catch (error) {
    next(error);
  }
};

function detectMerchant(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (
      line.length > 3 &&
      !/\d/.test(line)
    ) {
      return line;
    }
  }

  return "Unknown Merchant";
}

function detectDate(text) {
  const match = text.match(
    /\b(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})\b/
  );

  return match ? match[1] : "";
}

function detectAmount(text) {
  const lines = text.split("\n");

  let total = 0;

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (
      lower.includes("total") ||
      lower.includes("grand total")
    ) {
      const match = line.match(
        /(\d+[.,]?\d{0,2})/
      );

      if (match) {
        total = parseFloat(
          match[1].replace(",", "")
        );
      }
    }
  }

  if (total > 0) {
    return total;
  }

  const amounts =
    text.match(/\d+\.\d{2}/g) || [];

  return amounts.length
    ? Math.max(
        ...amounts.map(Number)
      )
    : 0;
}

function detectCategory(text) {
  const lower = text.toLowerCase();

  if (
    lower.includes("petrol") ||
    lower.includes("diesel") ||
    lower.includes("fuel")
  ) {
    return "Fuel";
  }

  if (
    lower.includes("restaurant") ||
    lower.includes("pizza") ||
    lower.includes("burger") ||
    lower.includes("cafe")
  ) {
    return "Food";
  }

  if (
    lower.includes("pharmacy") ||
    lower.includes("medical")
  ) {
    return "Medical";
  }

  if (
    lower.includes("supermarket") ||
    lower.includes("grocery") ||
    lower.includes("mart")
  ) {
    return "Grocery";
  }

  if (
    lower.includes("amazon") ||
    lower.includes("flipkart")
  ) {
    return "Shopping";
  }

  return "General";
}