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

// Driver: Get my rides - /getMyRides?id=5
// Response: [{“rideStartTime”:<timestamp>, “source”:{“x_coordinate”:3, “y_coordinate”:5}, “destination”:{“x_coordinate”:3, “y_coordinate”:5}, “durationInMins”:10,”costInRupees”:10, “rider”: {“id”:100,”name””Kali”}, “status”: “Done/Live”}, “rating”: 3}]
// Done: Means that the ride is completed
// Live: Ride is currently in progress

export default router;
