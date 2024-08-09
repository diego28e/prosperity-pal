import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the quotes.json file
const quotesFilePath = path.join(__dirname, "quotes.json");
const quotes = JSON.parse(fs.readFileSync(quotesFilePath, "utf-8"));

// Function to get a random quote
export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};
