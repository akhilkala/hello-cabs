import express from "express";
import protect from "../middleware/protect";
import {
  getAll,
  getDriverById,
  getMyTrips,
  getPosition,
  updatePosition,
} from "../controllers/driver";
import { body } from "express-validator";
import { isValidCoordinate } from "../utils/utilities";
import { validateRequest } from "../middleware/validateRequest";

const router = express.Router();

router.get("/all", getAll);
router.get("/myTrips", protect("driver"), getMyTrips);
router.get("/:id", getDriverById);
router.get("/position/:id", getPosition);
router.patch(
  "/position/:id",
  body("position").custom(isValidCoordinate),
  validateRequest,
  updatePosition
);

export default router;
