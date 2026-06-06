export const parseReceipt = (text) => {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const merchant =
    lines.find(
      (l) =>
        l.length > 3 &&
        !/\d/.test(l) &&
        l === l.toUpperCase()
    ) || lines[0] || "Unknown Merchant";

  let amount = 0;

  const totalMatch =
    text.match(/total[:\s]*\$?\s*(\d+\.\d{2})/i) ||
    text.match(/amount[:\s]*\$?\s*(\d+\.\d{2})/i);

  if (totalMatch) {
    amount = parseFloat(totalMatch[1]);
  } else {
    const amounts = text.match(/\d+\.\d{2}/g) || [];
    const numbers = amounts.map(Number);
    amount = numbers.length ? Math.max(...numbers) : 0;
  }

 const dateMatch = text.match(
  /\b\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}\b/
);

let date = null;

if (dateMatch) {
  const raw = dateMatch[0];

  const parts = raw.split(/[\/.-]/);

  if (parts.length === 3) {
    let [d, m, y] = parts;

    if (y.length === 2) {
      y = "20" + y;
    }

    const parsedDate = new Date(
      `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
    );

    if (!isNaN(parsedDate.getTime())) {
      date = parsedDate;
    }
  }
}
  // ---------------- CATEGORY ----------------
  const lower = text.toLowerCase();

  let category = "General";

  if (/fuel|petrol|diesel/.test(lower)) {
    category = "Fuel";
  } else if (/restaurant|cafe|pizza|burger|food|taco/.test(lower)) {
    category = "Food";
  } else if (/pharmacy|medical|hospital/.test(lower)) {
    category = "Medical";
  } else if (/supermarket|grocery|mart/.test(lower)) {
    category = "Grocery";
  } else if (/amazon|flipkart/.test(lower)) {
    category = "Shopping";
  }

  return {
    merchant,
    amount,
    date, // ✅ NOW THIS IS A REAL DATE OBJECT
    category,
  };
};