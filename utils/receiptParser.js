export const parseReceipt = (text) => {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // ---------------- MERCHANT ----------------
  const merchant =
    lines.find((l) => l.length > 3 && !/\d/.test(l)) ||
    "Unknown Merchant";

  // ---------------- AMOUNT ----------------
  const amounts = text.match(/\d+[.,]?\d{0,2}/g) || [];
  const numbers = amounts.map((n) => parseFloat(n.replace(",", "")));

  const amount = numbers.length ? Math.max(...numbers) : 0;

  // ---------------- DATE ----------------
  const dateMatch = text.match(
    /\b\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}\b/
  );

  const date = dateMatch ? dateMatch[0] : "";

  // ---------------- CATEGORY ----------------
  const lower = text.toLowerCase();

  let category = "General";

  if (/fuel|petrol|diesel/.test(lower)) category = "Fuel";
  else if (/restaurant|cafe|pizza|burger/.test(lower)) category = "Food";
  else if (/pharmacy|medical/.test(lower)) category = "Medical";
  else if (/supermarket|grocery|mart/.test(lower)) category = "Grocery";
  else if (/amazon|flipkart/.test(lower)) category = "Shopping";

  return {
    merchant,
    amount,
    date,
    category,
  };
};