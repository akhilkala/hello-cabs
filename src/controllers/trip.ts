import {
  getCostToCoverDistance,
  getDistanceBetweenCoords,
  getTimeToCoverDistance,
  route,
} from "../utils/utilities";

export const getTripDetails = route((req, res) => {
  const distance = getDistanceBetweenCoords(
    req.body.source,
    req.body.destination
  );

  res.status(200).json({
    timeNeededInMinutes: getTimeToCoverDistance(distance),
    costInRupees: getCostToCoverDistance(distance),
  });
});

export const getAvailableCabs = route(async (req, res) => {});

export const rateTrip = route(async (req, res) => {});

export const startTrip = route(async (req, res) => {});

export const endTrip = route(async (req, res) => {});

export const bookTrip = route(async (req, res) => {});
