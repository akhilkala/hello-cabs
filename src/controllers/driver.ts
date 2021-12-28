import Driver from "../models/Driver";
import Trip from "../models/Trip";
import { route } from "../utils/utilities";

export const getAll = route(async (req, res) => {
  const drivers = await Driver.findAll();
  res.status(200).json({
    success: true,
    data: drivers,
  });
});

export const getDriverById = route(async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: driver,
  });
});

export const getMyTrips = route(async (req, res) => {
  const trips = await Trip.findDriverTrips(req.user.id);
  res.status(200).json({
    success: true,
    data: trips,
  });
});

export const getPosition = route(async (req, res) => {
  const pos = await Driver.getCurrentPosition(req.params.id);
  res.status(200).json({
    success: true,
    data: pos,
  });
});

export const updatePosition = route(async (req, res) => {
  await Driver.updateCurrentPosition(req.params.id, req.body.position);
  res.status(200).json({
    success: true,
  });
});
