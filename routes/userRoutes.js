import express from "express";
import passport from "passport";
import {
  getIncomeTags,
  getIncomesForCurrentMonth,
  deleteIncome,
} from "../controllers/incomeController.js";
import {
  getExpenseTags,
  getExpensesForCurrentMonth,
  deleteExpense,
} from "../controllers/expenseController.js";
import { DateTime } from "luxon";
import { getRandomQuote } from "../quotes.js";

const router = express.Router();

router.get("/", (req, res) => {
  const randomQuote = getRandomQuote();
  res.render("home.ejs", {
    quote: randomQuote.quote,
    author: randomQuote.author,
  });
});

router.get("/login", (req, res) => {
  const randomQuote = getRandomQuote();
  res.render("login.ejs", {
    quote: randomQuote.quote,
    author: randomQuote.author,
  });
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/secrets", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      // Get current month and year if not provided in the query
      const currentDate = DateTime.now();
      const month = req.query.month || currentDate.toFormat("MM");
      const year = req.query.year || currentDate.toFormat("yyyy");

      // Format the date for display (e.g., "September 2024")
      const formattedDate = DateTime.fromObject({ year, month }).toFormat(
        "MMMM yyyy"
      );

      const incomeTags = await getIncomeTags(req, res);
      const expenseTags = await getExpenseTags(req, res);
      const { incomes, totalIncome } = await getIncomesForCurrentMonth(
        req,
        res
      );
      const { expenses, totalExpenses } = await getExpensesForCurrentMonth(
        req,
        res
      );

      const randomQuote = getRandomQuote(); // Get a random quote

      res.render("dashboard.ejs", {
        displayName: req.user.username,
        incomeTags: incomeTags,
        expenseTags: expenseTags,
        incomes: incomes,
        totalIncome: totalIncome,
        expenses: expenses,
        totalExpenses: totalExpenses,
        formattedDate: formattedDate,
        month: month,
        year: year,
        quote: randomQuote.quote, // Pass the quote
        author: randomQuote.author, // Pass the author
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  } else {
    res.redirect("/");
  }
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    successRedirect: "/secrets",
    failureRedirect: "/",
  })
);

router.post("/income/delete/:id", deleteIncome);
router.post("/expense/delete/:id", deleteExpense);

export default router;
