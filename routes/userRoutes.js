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
import moment from "moment";
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
  console.log(req.user);

  if (req.isAuthenticated()) {
    try {
      const month = req.query.month || moment().format("MM");
      const year = req.query.year || moment().format("YYYY");

      const formattedDate = moment(`${year}-${month}-01`).format("MMMM YYYY");

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
      console.log(incomes);
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
