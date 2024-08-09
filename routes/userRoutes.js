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

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home.ejs");
});

router.get("/login", (req, res) => {
  res.render("login.ejs");
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
      res.render("dashboard.ejs", {
        displayName: req.user.username,
        incomeTags: incomeTags,
        expenseTags: expenseTags,
        incomes: incomes,
        totalIncome: totalIncome,
        expenses: expenses,
        totalExpenses: totalExpenses,
      });
      console.log(incomes);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  } else {
    res.redirect("/login");
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
    failureRedirect: "/login",
  })
);

router.post("/income/delete/:id", deleteIncome);
router.post("/expense/delete/:id", deleteExpense);

export default router;
