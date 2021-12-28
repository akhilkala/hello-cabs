import db from "../utils/db";

const createTable = () =>
  db.query(`
  CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL,
    name VARCHAR (128) NOT NULL,
    email VARCHAR (128) NOT NULL,
    password VARCHAR (128) NOT NULL,
    walletBalance INT NOT NULL,
    PRIMARY KEY (id)
)`);

const insert = async (params: string[]) => {
  return db.query(
    `
  INSERT INTO "user" (
    name,
    email,
    password
    ) VALUES($1, $2, $3) ON CONFLICT DO NOTHING RETURNING *`,
    params
  );
};

const findAll = async () => {
  const { rows } = await db.query(`SELECT * FROM "user"`);
  return rows;
};

const findByEmail = async (email: string) => {
  const { rows } = await db.query(`SELECT * FROM "user" WHERE email = $1`, [
    email,
  ]);
  return rows[0];
};

const findById = async (id: string) => {
  const { rows } = await db.query(`SELECT * FROM "user" WHERE id = $1`, [id]);
  return rows[0];
};

export default {
  createTable,
  insert,
  findAll,
  findByEmail,
  findById,
};
