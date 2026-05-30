export const detectMerchant = (text) => {
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
};

export const detectDate = (text) => {
  const patterns = [
    /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/,
    /\b\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}\b/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      return match[0];
    }
  }

  return "";
};

export const detectAmount = (text) => {
  const lines = text.split("\n");

  let total = 0;

  for (const line of lines) {
    const lower = line.toLowerCase();

    const match = line.match(
      /(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{2})?)/i
    );

    if (!match) continue;

    const amount = parseFloat(
      match[1].replace(/,/g, "")
    );

    if (isNaN(amount)) continue;

    if (
      lower.includes("total") &&
      !lower.includes("subtotal")
    ) {
      return amount;
    }

    if (amount > total) {
      total = amount;
    }
  }

  return total;
};

export const detectCategory = (text) => {
  const lower = text.toLowerCase();

  const merchantMap = {
    "indian oil": "Fuel",
    "bharat petroleum": "Fuel",
    "hp petrol": "Fuel",
    shell: "Fuel",

    kfc: "Food",
    mcdonald: "Food",
    dominos: "Food",
    "pizza hut": "Food",

    amazon: "Shopping",
    flipkart: "Shopping",

    medplus: "Medical",
    "apollo pharmacy": "Medical",

    "reliance fresh": "Grocery",
    "d mart": "Grocery",
    "big bazaar": "Grocery",
  };

  for (const merchant in merchantMap) {
    if (lower.includes(merchant)) {
      return merchantMap[merchant];
    }
  }

  const categories = {
    Food: [
      "restaurant",
      "food",
      "burger",
      "pizza",
      "cafe",
      "bakery",
    ],

    Grocery: [
      "grocery",
      "supermarket",
      "mart",
      "vegetable",
      "rice",
      "milk",
    ],

    Fuel: [
      "petrol",
      "diesel",
      "fuel",
      "ltr",
      "litre",
    ],

    Medical: [
      "pharmacy",
      "medical",
      "tablet",
      "capsule",
      "medicine",
    ],

    Shopping: [
      "fashion",
      "electronics",
      "retail",
      "mall",
    ],
  };

  const scores = {};

  Object.keys(categories).forEach((cat) => {
    scores[cat] = 0;
  });

  for (const category in categories) {
    categories[category].forEach((keyword) => {
      if (lower.includes(keyword)) {
        scores[category]++;
      }
    });
  }

  let bestCategory = "General";
  let highestScore = 0;

  for (const category in scores) {
    if (scores[category] > highestScore) {
      highestScore = scores[category];
      bestCategory = category;
    }
  }

  return bestCategory;
};

export const parseReceipt = (text) => {
  return {
    merchant: detectMerchant(text),
    amount: detectAmount(text),
    date: detectDate(text),
    category: detectCategory(text),
  };
};