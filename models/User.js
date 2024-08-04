import db from "../db.js";
import bcrypt from "bcrypt";

export const createUser = async (username, email, password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const result = await db.query(
    "INSERT INTO Users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, hashedPassword]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM Users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await db.query("SELECT * FROM Users WHERE id = $1", [id]);
  return result.rows[0];
};

export const findUserByGoogleId = async (google_id) => {
  const result = await db.query("SELECT * FROM Users WHERE google_id = $1", [
    google_id,
  ]);
  return result.rows[0];
};
