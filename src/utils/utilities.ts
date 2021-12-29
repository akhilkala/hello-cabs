import { NextFunction, Request, Response } from "express";
import { CustomValidator } from "express-validator";
import jwt from "jsonwebtoken";
import Driver from "../models/Driver";
import Trip from "../models/Trip";
import { COST_PER_UNIT, TIME_TAKEN_PER_UNIT } from "./constants";
import { Coordinate, Route } from "./types";

export const route =
  (fn: Route) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
// Route type for intellisence

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  res.status(500).json({
    error: err.message || "Something went wrong!",
  });
};
// Global error handler

export const generateToken = (payload: any) => {
  if (!process.env.SECRET) throw new Error("Environment Invalid");
  return jwt.sign(payload, process.env.SECRET);
};
// Function to generate JWT token

export const verifyToken = (token: any) => {
  if (!process.env.SECRET) throw new Error("Environment Invalid");
  try {
    return jwt.verify(token, process.env.SECRET);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
// Function to verify JWT token

export const isValidCoordinate: CustomValidator = (value: Coordinate) => {
  const check =
    !!value && !isNaN(value.x_coordinate) && !isNaN(value.y_coordinate);

  if (!check) throw new Error("Invalid or missing coordinates");

  return true;
};
// Custom validator for express-validator to check if value is a valid coordinate

export const getDistanceBetweenCoords = (from: Coordinate, to: Coordinate) => {
  return Math.sqrt(
    Math.pow(from.x_coordinate - to.x_coordinate, 2) +
      Math.pow(from.y_coordinate - to.y_coordinate, 2)
  );
};
// Function that returns distance between two coordinates

export const getTimeToCoverDistance = (distance: number) =>
  TIME_TAKEN_PER_UNIT * distance;
// Function that returns the time it will take to cover given distance

export const getCostToCoverDistance = (distance: number) =>
  Math.ceil(COST_PER_UNIT * distance);
// Function that returns the cost to cover given distance

export const setDriverRatings = async () => {
  const drivers = await Driver.findAll(true);
  for (let i = 0; i < drivers.length; i++) {
    const trips = await Trip.findDriverTrips(drivers[i].id);
    let total = 0;
    for (let j = 0; j < trips.length; j++) {
      total += trips[j].rating;
    }
    await Driver.setRating(drivers[i].id, total / trips.length);
  }
};
// Function to set drivers ratings
// Can improve with SQL Agregate functions
