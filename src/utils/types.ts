import { NextFunction, Request, Response } from "express";

export interface Coordinate {
  x_coordinate: number;
  y_coordinate: number;
}

export type Route = (req: Request, res: Response, next: NextFunction) => any;
