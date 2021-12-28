import { NextFunction, Request, Response } from "express";
import { CustomValidator } from "express-validator";
import jwt from "jsonwebtoken";
import { COST_PER_UNIT, TIME_TAKEN_PER_UNIT } from "./constants";
import { Coordinate, Route } from "./types";

export const route =
  (fn: Route) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

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

export const generateToken = (payload: any) => {
  if (!process.env.SECRET) throw new Error("Environment Invalid");
  return jwt.sign(payload, process.env.SECRET);
};

export const verifyToken = (token: any) => {
  if (!process.env.SECRET) throw new Error("Environment Invalid");
  try {
    return jwt.verify(token, process.env.SECRET);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const isValidCoordinate: CustomValidator = (value) => {
  return true;
};

export const getDistanceBetweenCoords = (from: Coordinate, to: Coordinate) =>
  Math.sqrt(
    Math.pow(from.x_coordinate - to.x_coordinate, 2) +
      Math.pow(from.y_coordinate - to.y_coordinate, 2)
  );

export const getTimeToCoverDistance = (distance: number) =>
  TIME_TAKEN_PER_UNIT * distance;

export const getCostToCoverDistance = (distance: number) =>
  COST_PER_UNIT * distance;
