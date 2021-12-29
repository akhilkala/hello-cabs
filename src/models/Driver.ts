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
    currentTrip_id INT,
    goingToUser BOOL NOT NULL,
    tripsCompleted INT NOT NULL,
    currentLocation_x FLOAT,
    currentLocation_y FLOAT,
    PRIMARY KEY (id)
  )`);

const addForeignKey = async () => {
  await db.query(`
  ALTER TABLE driver ADD FOREIGN KEY (currentTrip_id) REFERENCES trip(id)
`);
};

const insert = async (params: any[]) => {
  return db.query(
    `
    INSERT INTO driver (
      name,
      email,
      password,
      tripsCompleted,
      currentLocation_x,
      currentLocation_y,
      goingToUser
      ) VALUES($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING RETURNING *;`,
    params
  );
};

const findAll = async (onlyId = false) => {
  const query = onlyId ? `SELECT id FROM driver;` : `SELECT * FROM driver;`;
  const { rows } = await db.query(query);
  return rows;
};

const findById = async (id: string) => {
  const { rows } = await db.query(`SELECT * FROM driver WHERE id = $1;`, [id]);
  return rows[0];
};

const findByEmail = async (email: string) => {
  const { rows } = await db.query(`SELECT * FROM driver WHERE email = $1;`, [
    email,
  ]);
  return rows[0];
};

const getCurrentPosition = async (id: string) => {
  const { rows } = await db.query(
    `SELECT currentLocation_x, currentLocation_y FROM driver WHERE id = $1;`,
    [id]
  );
  return rows[0];
};

const updateCurrentPosition = async (id: string, coords: Coordinate) => {
  await db.query(
    `
  UPDATE driver
  SET currentLocation_x = $2, currentLocation_y = $3
  WHERE id = $1;
    `,
    [id, coords.x_coordinate, coords.y_coordinate]
  );
};

const setCurrentTrip = async (id: string, tripId: string) => {
  await db.query(
    `
  UPDATE driver
  SET currentTrip_id = $2, goingToUser = $3
  WHERE id = $1;
    `,
    [id, tripId, false]
  );
};

const completeTrip = async (id: string) => {
  await db.query(
    `
  UPDATE driver
  SET currentTrip_id = NULL, tripsCompleted = tripsCompleted + 1
  WHERE id = $1;
    `,
    [id]
  );
};

const setGoingToUser = async (id: string) => {
  await db.query(
    `
  UPDATE driver
  SET goingToUser = $2
  WHERE id = $1;
    `,
    [id, true]
  );
};

const setRating = async (id: string, rating: number) => {
  await db.query(
    `
  UPDATE driver
  SET rating = $2
  WHERE id = $1;
    `,
    [id, rating]
  );
};

export default {
  createTable,
  insert,
  addForeignKey,
  findAll,
  findById,
  findByEmail,
  getCurrentPosition,
  updateCurrentPosition,
  setCurrentTrip,
  completeTrip,
  setGoingToUser,
  setRating,
};
