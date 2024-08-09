import db from "../config/db.js";
import moment from "moment";

export const addIncome = async (req, res) => {
  const { amount, date, tag_name } = req.body;
  const user_id = req.user.id;

  try {
    // Insert the tag if it doesn't exist
    await db.query(
      `INSERT INTO incometags (user_id, name) 
             VALUES ($1, $2) 
             ON CONFLICT (user_id, name) DO NOTHING`,
      [user_id, tag_name.trim()]
    );

    // Retrieve the tag_id for the given tag_name
    const tagResult = await db.query(
      "SELECT id FROM incometags WHERE user_id = $1 AND name = $2",
      [user_id, tag_name.trim()]
    );

    if (tagResult.rows.length === 0) {
      console.log("Tag not found in incometags table.");
      return res.status(400).send("Invalid tag name.");
    }

    const tag_id = tagResult.rows[0].id;
    console.log("Tag ID:", tag_id);

    // Insert the income entry with the retrieved tag_id
    await db.query(
      "INSERT INTO income (user_id, amount, date, tag_id) VALUES ($1, $2, $3, $4)",
      [user_id, amount, date, tag_id]
    );
    res.redirect("/secrets");
  } catch (err) {
    console.error("Database insertion error:", err);
    res.status(500).send("Server error");
  }
};

// Fetch incomes for the current month
export const getIncomesForCurrentMonth = async (req, res) => {
  const user_id = req.user.id;
  const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
  const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");

  try {
    console.log(
      `Fetching incomes for user_id: ${user_id} between ${startOfMonth} and ${endOfMonth}`
    );

    // Fetch incomes
    const incomesResult = await db.query(
      `SELECT income.amount, income.date, incometags.name AS tag_name
       FROM income
       JOIN incometags ON income.tag_id = incometags.id
       WHERE income.user_id = $1 AND income.date BETWEEN $2 AND $3
       ORDER BY income.date`,
      [user_id, startOfMonth, endOfMonth]
    );

    const incomes = incomesResult.rows;
    const totalIncome = incomes.reduce(
      (total, income) => total + parseFloat(income.amount),
      0
    );

    // Log the data retrieved from the database
    console.log("Incomes retrieved from database:", incomes);
    console.log("Total Income:", totalIncome);

    return { incomes, totalIncome };
  } catch (err) {
    console.error("Database query error:", err);
    /* res.status(500).send("Server error"); */
    return { incomes: [], totalIncome: 0 };
  }
};

export const getIncomeTags = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM incometags WHERE user_id = $1",
      [req.user.id]
    );
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
