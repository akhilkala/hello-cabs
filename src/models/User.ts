import db from "../utils/db";

const createTable = () =>
  db.query(`
  CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL,
    name VARCHAR (128) NOT NULL,
    email VARCHAR (128) NOT NULL,
    password VARCHAR (128) NOT NULL,
    walletBalance FLOAT NOT NULL,
    PRIMARY KEY (id)
)`);

const insert = async (params: string[]) => {
  return db.query(
    `
  INSERT INTO "user" (
    name,
    email,
    password,
    walletBalance
    ) VALUES($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING *;`,
    params
  );
};

const findAll = async () => {
  const { rows } = await db.query(`SELECT * FROM "user";`);
  return rows;
};

const findByEmail = async (email: string) => {
  const { rows } = await db.query(`SELECT * FROM "user" WHERE email = $1;`, [
    email,
  ]);
  return rows[0];
};

const findById = async (id: string) => {
  const { rows } = await db.query(`SELECT * FROM "user" WHERE id = $1;`, [id]);
  return rows[0];
};

const addBalance = async (id: string, amount: number) => {
  await db.query(
    `UPDATE "user"
  SET walletBalance = walletBalance + $2
  WHERE id = $1;`,
    [id, amount]
  );
};

const removeBalance = async (id: string, amount: number) => {
  await db.query(
    `UPDATE "user"
  SET walletBalance = walletBalance - $2
  WHERE id = $1;`,
    [id, amount]
  );
};

export default {
  createTable,
  insert,
  findAll,
  findByEmail,
  findById,
  addBalance,
  removeBalance,
};
