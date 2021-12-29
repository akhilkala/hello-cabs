import Trip from "../models/Trip";
import User from "../models/User";
import { route } from "../utils/utilities";

export const getAll = route(async (req, res) => {
  const users = await User.findAll();
  res.status(200).json({
    data: users.map((user) => ({ ...user, password: undefined })),
  });
});

export const getUserById = route(async (req, res) => {
  const user = await User.findById(req.params.id);

  delete user.password;
  res.status(200).json({
    data: user,
  });
});

export const getMyTrips = route(async (req, res) => {
  const trips = await Trip.findUserTrips(req.user.id);
  res.status(200).json({
    data: trips,
  });
});

export const deposit = route(async (req, res) => {
  await User.addBalance(req.user.id, req.body.amount);
  res.sendStatus(200);
});
