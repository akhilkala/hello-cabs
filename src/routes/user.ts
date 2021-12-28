import express from "express";
import { getAll, getMyTrips, getUserById } from "../controllers/user";
import protect from "../middleware/protect";

const router = express.Router();

router.get("/all", getAll);
router.get("/myTrips", protect("user"), getMyTrips);
router.get("/:id", getUserById);

export default router;
