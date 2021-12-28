import {
  MAX_PERMITTED_DISTANCE_TO_DRIVER,
  PERMITTED_DISTANCE_TO_DRIVER,
} from "../utils/constants";
import db from "../utils/db";
import { Coordinate } from "../utils/types";

const createTable = () =>
  db.query(`
  CREATE TABLE IF NOT EXISTS trip(
      id SERIAL,
      driver_id INT NOT NULL, 
      user_id INT NOT NULL,
      source_x FLOAT,
      source_y FLOAT,
      destination_x FLOAT,
      destination_y FLOAT,
      started BOOL NOT NULL,
      completed BOOL NOT NULL,
      fare FLOAT NOT NULL,
      rating FLOAT,
      startTime TIMESTAMP,
      endTime TIMESTAMP,
      PRIMARY KEY (id),
      FOREIGN KEY (driver_id) REFERENCES driver(id),
      FOREIGN KEY (user_id) REFERENCES "user"(id)
      )`);

const insert = async (params: string[]) => {
  return db.query(
    `
    INSERT INTO driver (
      driver_id,
      user_id,
      source_x,
      source_y,
      destination_x,
      destination_y,
      started,
      completed,
      fare
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING RETURNING *;`,
    params
  );
};

const findDriverTrips = async (id: string) => {
  const { rows } = await db.query(`SELECT * FROM trip WHERE driver_id = $1;`, [
    id,
  ]);

  return rows[0];
};

const findUserTrips = async (id: string) => {
  const { rows } = await db.query(`SELECT * FROM trip WHERE user_id = $1;`, [
    id,
  ]);

  return rows[0];
};

const findTripUserId = async (id: string) => {
  const { rows } = await db.query(
    `SELECT id, user_id, started, completed FROM trip WHERE id = $1;`,
    [id]
  );

  return rows[0];
};

const setRating = async (id: string, rating: number) => {
  await db.query(
    `UPDATE trip
  SET rating = $2
  WHERE id = $1;`,
    [id, rating]
  );
};

const start = async (id: string) => {
  await db.query(
    `UPDATE trip
  SET started = $2
  WHERE id = $1;`,
    [id, true]
  );
};

const end = async (id: string) => {
  await db.query(
    `UPDATE trip
  SET completed = $2
  WHERE id = $1;`,
    [id, true]
  );
};

const findNearbyCabs = async (location: Coordinate, max = false) => {
  // LEFT JOIN trip ON trip.id = driver.currentTrip_id
  const { rows } = await db.query(
    `SELECT * 
    FROM driver 
    WHERE sqrt(pow(driver.currentLocation_x - $1 ,2) + pow(driver.currentLocation_y - $2, 2)) < ${
      max ? MAX_PERMITTED_DISTANCE_TO_DRIVER : PERMITTED_DISTANCE_TO_DRIVER
    }
    and goingToUser = false`,
    [location.x_coordinate, location.y_coordinate]
  );
  return rows;
};

export default {
  createTable,
  insert,
  findDriverTrips,
  findUserTrips,
  findNearbyCabs,
  findTripUserId,
  setRating,
  start,
  end,
};
