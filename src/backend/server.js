import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS only for frontend origin
const FRONTEND_URL = process.env.FRONTEND_URL || "*";
app.use(cors({ origin: FRONTEND_URL }));

// Load CSV data
let products = [];
try {
  const csvFilePath = path.join(process.cwd(), "data/data.csv"); // backend/data/data.csv
  if (!fs.existsSync(csvFilePath)) throw new Error("CSV file not found");
  const csvData = fs.readFileSync(csvFilePath, "utf-8");
  products = parse(csvData, { columns: true, skip_empty_lines: true, trim: true });
  console.log(`Loaded ${products.length} products from CSV`);
} catch (err) {
  console.error("Error loading CSV file:", err.message);
  products = [];
}

// Categories list (adjust if needed)
const categories = [
  "floor cleaner",
  "naphthalene balls",
  "floor wiper",
  "other essentials",
  "candles",
  "brooms",
  "cotton mops",
  "dusters",
  "boric powder"
];

// API endpoint
app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ text: "Invalid or empty query provided." });
  }

  const lowerMessage = message.toLowerCase().trim();
  let productQuery = lowerMessage.startsWith("tell me about ")
    ? lowerMessage.replace("tell me about ", "").trim()
    : lowerMessage;

  // Exact product match
  const product = products.find(p => p.Name && p.Name.toLowerCase() === productQuery);

  if (product) {
    const responseText = `${product.Name}: MRP: ${product.MRP}, Selling Rate: ${product["Selling Rate"]}`;
    return res.json({ text: responseText });
  }

  // Category match
  const categoryPrefixes = ["show me ", "list ", "category ", "products for "];
  const matchedCategory = categories.find(cat => {
    const lowerCat = cat.toLowerCase();
    return (
      lowerMessage === lowerCat ||
      categoryPrefixes.some(prefix => lowerMessage === `${prefix}${lowerCat}`)
    );
  });

  if (matchedCategory) {
    const categoryProducts = products
      .filter(p => p.Category.toLowerCase() === matchedCategory.toLowerCase())
      .slice(0, 3);

    if (categoryProducts.length > 0) {
      const responseText = categoryProducts
        .map(p => `${p.Name}: MRP: ${p.MRP}, Selling Rate: ${p["Selling Rate"]}`)
        .join("\n\n");
      return res.json({ text: responseText });
    } else {
      return res.json({ text: `No products found for category: ${matchedCategory}.` });
    }
  }

  // Fallback message for non-matching queries
  return res.json({
    text: "Products can be searched by exact name (e.g., 'C30 White Candles' or 'tell me about C30 White Candles') or by category (e.g., 'candles' or 'show me candles')."
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unexpected server error:", err.message);
  res.status(500).json({ text: "Unexpected server error. Please try again later." });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
