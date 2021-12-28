import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/utilities";

type Options = "user" | "driver";

export default (option: Options) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) throw new Error();

      const user = verifyToken(token);
      req.user = user;

      if (req.user.role != option) throw new Error();

      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: "Auth Failed",
      });
    }
  };
};
// Function to verify if the user is logged in and if she is allowed to
// access resources based on her role (driver / rider)
