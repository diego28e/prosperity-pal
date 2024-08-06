import express from "express";
import {
  addExpenseTag,
  getExpenseTags,
} from "../controllers/expenseTagsController.js";

const router = express.Router();

// Route to add a new expense tag
router.post("/add", addExpenseTag);

// Route to get all expense tags
router.get("/tags", async (req, res) => {
  try {
    const tags = await getExpenseTags(req, res);
    res.render("dashboard", {
      expenseTags: tags,
      displayName: req.user.displayName,
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

export default router;
