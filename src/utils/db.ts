import { Pool } from "pg";
import User from "../models/User";
import Driver from "../models/Driver";

import dotenv from "dotenv";
dotenv.config();

if (
  !process.env.PG_USER ||
  !process.env.PG_PASSWORD ||
  !process.env.PG_HOST ||
  !process.env.PG_DATABSE ||
  !process.env.PG_PORT
)
  throw new Error("Environment Invalid");

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABSE,
  port: parseInt(process.env.PG_PORT || "5432"),
});

export const createTables = async () => {
  await User.createTable();
  await Driver.createTable();
};

export default pool;
