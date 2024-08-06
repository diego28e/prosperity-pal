import db from "../config/db.js";

export const addExpense = async (req, res) => {
  const { amount, date, tag_name } = req.body;
  const user_id = req.user.id;

  // Log the values received from the frontend
  console.log("Received values from frontend:");
  console.log("Amount:", amount);
  console.log("Date:", date);
  console.log("Tag Name:", tag_name);
  console.log("User ID:", user_id);

  try {
    // Insert the tag if it doesn't exist
    await db.query(
      `INSERT INTO expensetags (user_id, name) 
           VALUES ($1, $2) 
           ON CONFLICT (user_id, name) DO NOTHING`,
      [user_id, tag_name.trim()]
    );

    // Retrieve the tag_id for the given tag_name
    const tagResult = await db.query(
      "SELECT id FROM expensetags WHERE user_id = $1 AND name = $2",
      [user_id, tag_name.trim()]
    );

    if (tagResult.rows.length === 0) {
      console.log("Tag not found in expensetags table.");
      return res.status(400).send("Invalid tag name.");
    }

    const tag_id = tagResult.rows[0].id;
    console.log("Tag ID:", tag_id);

    // Insert the expense entry with the retrieved tag_id
    await db.query(
      "INSERT INTO expenses (user_id, amount, date, tag_id) VALUES ($1, $2, $3, $4)",
      [user_id, amount, date, tag_id]
    );
    res.redirect("/secrets");
  } catch (err) {
    console.error("Database insertion error:", err);
    res.redirect("/secrets");
  }
};

export const getExpenseTags = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM expensetags WHERE user_id = $1",
      [req.user.id]
    );
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
