import db from "../config/db.js";

export const addIncome = async (req, res) => {
  const { amount, date, tag_name } = req.body;
  const user_id = req.user.id;

  // Log the values received from the frontend
  console.log("Received values from frontend:");
  console.log("Amount:", amount);
  console.log("Date:", date);
  console.log("Tag Name:", tag_name);
  console.log("User ID:", user_id);

  try {
    // Retrieve the tag_id for the given tag_name
    const tagResult = await db.query(
      "SELECT id FROM incometags WHERE user_id = $1 AND name = $2",
      [user_id, tag_name]
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
    res.redirect("/secrets");
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
