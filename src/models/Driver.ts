import db from "../utils/db";
import { Coordinate } from "../utils/types";

const createTable = () =>
  db.query(`
  CREATE TABLE IF NOT EXISTS driver(
      id SERIAL,
      name VARCHAR (128) NOT NULL,
      email VARCHAR (128) NOT NULL,
      password VARCHAR (128) NOT NULL,
      rating FLOAT,
      isAvailable BOOL NOT NULL,
      tripsCompleted INT NOT NULL,
      currentLocation POINT,
      PRIMARY KEY (id)
  )`);

const insert = async (params: (string | number)[]) => {
  return db.query(
    `
    INSERT INTO driver (
      name,
      email,
      password,
      isAvailable,
      tripsCompleted,
      currentLocation
      ) VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING RETURNING *`,
    params
  );
};

const findAll = async () => {
  const { rows } = await db.query(`SELECT * FROM driver`);
  return rows;
};

const findById = async (id: string) => {
  const { rows } = await db.query(`SELECT * FROM driver WHERE id = $1`, [id]);
  return rows[0];
};

const findByEmail = async (email: string) => {
  const { rows } = await db.query(`SELECT * FROM driver WHERE email = $1`, [
    email,
  ]);
  return rows[0];
};

const getCurrentPosition = async (id: string) => {
  const { rows } = await db.query(
    `SELECT currentLocation FROM driver WHERE id = $1`,
    [id]
  );
  return rows[0];
};

const updateCurrentPosition = async (id: string, coords: Coordinate) => {
  await db.query(
    `
  UPDATE driver
  SET currentLocation = ($2, $3)
  WHERE id = $1;
    `,
    [id, coords.x_coordinate, coords.y_coordinate]
  );
};

export default {
  createTable,
  insert,
  findAll,
  findById,
  findByEmail,
  getCurrentPosition,
  updateCurrentPosition,
};
