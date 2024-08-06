import express from "express";
import {
  addIncomeTag,
  getIncomeTags,
} from "../controllers/incomeTagsController.js";

const router = express.Router();

// Route to add a new income tag
router.post("/add", addIncomeTag);

// Route to get all income tags
router.get("/tags", async (req, res) => {
  try {
    const tags = await getIncomeTags(req, res);
    res.render("dashboard", {
      incomeTags: tags,
      displayName: req.user.displayName,
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

export default router;
