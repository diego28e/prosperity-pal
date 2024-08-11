import pkg from "pg";
import dotenv from "dotenv";
import fs from "fs";

const { Pool } = pkg;
dotenv.config();

const caCert = Buffer.from(process.env.DB_CERT, "base64").toString("utf-8");

const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: {
    ca: caCert,
    rejectUnauthorized: true, // Enable SSL certificate verification
  },
});

export const queryDatabase = async (queryText, params) => {
  const client = await db.connect();
  try {
    const result = await client.query(queryText, params);
    return result.rows;
  } finally {
    client.release();
  }
};

export default db;
