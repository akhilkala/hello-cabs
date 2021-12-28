import express from "express";
import { body } from "express-validator";
import {
  bookTrip,
  endTrip,
  getAvailableCabs,
  getTripDetails,
  rateTrip,
  startTrip,
} from "../controllers/trip";
import protect from "../middleware/protect";
import { validateRequest } from "../middleware/validateRequest";
import { isValidCoordinate } from "../utils/utilities";

const router = express.Router();

// Works
router.get(
  "/details",
  body("source").custom(isValidCoordinate),
  body("destination").custom(isValidCoordinate),
  validateRequest,
  getTripDetails
);

router.get(
  "/availableCabs",
  body("location").custom(isValidCoordinate),
  validateRequest,
  getAvailableCabs
);

router.post(
  "/book",
  protect("user"),
  body("source").custom(isValidCoordinate),
  body("destination").custom(isValidCoordinate),
  validateRequest,
  bookTrip
);

router.patch(
  "/rate/:id",
  protect("user"),
  body("rating").notEmpty(),
  validateRequest,
  rateTrip
);

router.patch("/start/:id", protect("driver"), startTrip);

router.patch("/end/:id", protect("driver"), endTrip);

export default router;
