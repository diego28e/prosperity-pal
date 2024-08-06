import db from "../config/db.js";

export const addIncomeTag = async (req, res) => {
  // Simulate req.user for testing
  /*   if (!req.user) {
    req.user = { id: 8 }; // Replace with a valid user ID from your database
  }
 */
  const { name, is_recurrent } = req.body;
  const user_id = req.user.id;

  try {
    await db.query(
      "INSERT INTO incometags (user_id, name, is_recurrent) VALUES ($1, $2, $3) ON CONFLICT (user_id, name) DO UPDATE SET is_recurrent = EXCLUDED.is_recurrent",
      [user_id, name, is_recurrent]
    );
    res.redirect("/secrets");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
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
    console.error("Database query error:", err);
    throw err;
  }
};
