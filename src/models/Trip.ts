import db from "../utils/db";
import { Coordinate } from "../utils/types";

const createTable = () =>
  db.query(`
  CREATE TABLE IF NOT EXISTS trip(
      id SERIAL,
      driver_id INT NOT NULL, 
      user_id INT NOT NULL,
      source POINT,
      destination POINT,
      started BOOL NOT NULL,
      completed BOOL NOT NULL,
      fare FLOAT NOT NULL,
      rating FLOAT,
      startTime: TIMESTAMP NOT NULL,
      endTime: TIMESTAMP NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (driver_id) REFERENCES driver(id),
      FOREIGN KEY (user_id) REFERENCES user(id)
      `);

const insert = async (params: string[]) => {
  return db.query(
    `
    INSERT INTO driver (
      name,
      email,
      password,
      isAvailable
      ) VALUES($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING *`,
    params
  );
};

const findDriverTrips = async (id: string) => {
  const { rows } = await db.query(`SELECT * FROM trip WHERE driver_id = $1`, [
    id,
  ]);

  return rows[0];
};

const findUserTrips = async (id: string) => {
  const { rows } = await db.query(`SELECT * FROM trip WHERE user_id = $1`, [
    id,
  ]);

  return rows[0];
};

const findAvailableCabs = async (location: Coordinate) => {
  const { rows } = await db.query("");
  return rows[0];
};

export default {
  createTable,
  insert,
  findDriverTrips,
  findUserTrips,
};
