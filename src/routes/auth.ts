import express from "express";
import {
  driverLogin,
  driverRegister,
  userLogin,
  userRegister,
} from "../controllers/auth";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validateRequest";

const router = express.Router();

router.post(
  "/user/register",
  body("name", "Name is required").notEmpty(),
  body("email", "Email is invalid").isEmail(),
  body("password", "Password is required").notEmpty(),
  validateRequest,
  userRegister
);
router.post(
  "/user/login",
  body("email", "Email is invalid").isEmail(),
  body("password", "Password is required").notEmpty(),
  validateRequest,
  userLogin
);

router.post(
  "/driver/register",
  body("name", "Name is required").notEmpty(),
  body("email", "Email is invalid").isEmail(),
  body("password", "Password is required").notEmpty(),
  validateRequest,
  driverRegister
);
router.post(
  "/driver/login",
  body("email", "Email is invalid").isEmail(),
  body("password", "Password is required").notEmpty(),
  validateRequest,
  driverLogin
);

export default router;
