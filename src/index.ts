import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth";
import driverRoutes from "./routes/driver";
import userRoutes from "./routes/user";

import { errorHandler } from "./utils/utilities";
import { createTables } from "./utils/db";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/driver", driverRoutes);
app.use("/user", userRoutes);

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: "Not Found",
  });
});
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}...`);
  createTables();
});

//TODO: Write comments everywere
// Send res according to error in protect.ts
// Finish writing validator
// JOIN statement in /myTrips
// Learn SQL (insert() function in models)
// People can create user accounts and driver accounts
// isAvailable is useless vs currentTrip which is way better
// postgress primary key
// learn pg-node poll and stuff
