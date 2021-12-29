import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cron from "node-cron";

import authRoutes from "./routes/auth";
import driverRoutes from "./routes/driver";
import userRoutes from "./routes/user";
import tripRoutes from "./routes/trip";

import { errorHandler, setDriverRatings } from "./utils/utilities";
import { createTables } from "./utils/db";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// Using packages as middleware

app.use("/auth", authRoutes);
app.use("/driver", driverRoutes);
app.use("/user", userRoutes);
app.use("/trip", tripRoutes);
// Using routers

cron.schedule("0 0 1 * *", setDriverRatings);
// Running a cron job every month to update driver rating

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: "Not Found",
  });
});
// Using a not found handler
app.use(errorHandler);
// Using a global error handler

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}...`);
  createTables();
});
// Starting server and creating databases

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
// Declaring type for typescript intellisence
