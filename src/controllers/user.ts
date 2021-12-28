import Trip from "../models/Trip";
import User from "../models/User";
import { route } from "../utils/utilities";

export const getAll = route(async (req, res) => {
  const users = await User.findAll();
  res.status(200).json({
    success: true,
    data: users,
  });
});

export const getUserById = route(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

export const getMyTrips = route(async (req, res) => {
  const trips = await Trip.findUserTrips(req.user.id);
  res.status(200).json({
    success: true,
    data: trips,
  });
});
