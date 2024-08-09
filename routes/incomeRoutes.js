import express from "express";
import { addIncome, getIncomeTags } from "../controllers/incomeController.js";

const router = express.Router();

router.post("/add", addIncome);

router.get("/tags", getIncomeTags);

router.get("");

export default router;
