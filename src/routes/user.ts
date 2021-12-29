import express from "express";
import { body } from "express-validator";
import { getAll, getMyTrips, getUserById, deposit } from "../controllers/user";
import protect from "../middleware/protect";
import { validateRequest } from "../middleware/validateRequest";

const router = express.Router();

router.get("/all", getAll);
router.get("/myTrips", protect("user"), getMyTrips);
router.patch(
  "/deposit",
  protect("user"),
  body("amount", "Amount is required").notEmpty(),
  validateRequest,
  deposit
);
router.get("/:id", getUserById);

export default router;
