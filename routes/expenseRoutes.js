import express from "express";
import {
  addExpense,
  getExpenseTags,
} from "../controllers/expenseController.js";

const router = express.Router();

router.post("/add", addExpense);

router.get("/tags", getExpenseTags);

export default router;
