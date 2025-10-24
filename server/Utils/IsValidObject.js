import mongoose from "mongoose";

export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Whitelist fields for update
const ALLOWED_UPDATE_FIELDS = [
  "name",
  "description",
  "price",
  "category",
  "brand",
  "stock",
  "image",
];

// Clean and validate update fields
export const sanitizeProductData = (data = {}) => {
  const cleaned = {};

  for (const key of Object.keys(data)) {
    if (!ALLOWED_UPDATE_FIELDS.includes(key)) continue;

    let value = data[key];
    if (typeof value === "string") value = value.trim();

    switch (key) {
      case "price":
        const priceNum = parseFloat(value);
        if (Number.isNaN(priceNum) || priceNum < 0)
          throw new Error("Price must be a valid positive number");
        cleaned.price = priceNum;
        break;

      case "stock":
        const stockNum = parseInt(value, 10);
        if (Number.isNaN(stockNum) || stockNum < 0)
          throw new Error("Stock must be a valid positive number");
        cleaned.stock = stockNum;
        break;

      default:
        cleaned[key] = value;
    }
  }

  return cleaned;
};