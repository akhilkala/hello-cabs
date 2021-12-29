import Driver from "../models/Driver";
import Trip from "../models/Trip";
import User from "../models/User";
import { Coordinate } from "../utils/types";
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

export const rateTrip = route(async (req, res) => {
  const trip = await Trip.findTripDetails(req.params.id);
  if (req.user.id !== trip.user_id) {
    return res.status(401).json({
      message: "User cannot rate this trip",
    });
  }
  if (!trip.completed || !trip.started) {
    return res.status(400).json({
      message: "Cannot rate trip at this moment",
    });
  }

  await Trip.setRating(req.params.id, req.body.rating);

  res.sendStatus(200);
});

export const startTrip = route(async (req, res) => {
  const trip = await Trip.findTripDetails(req.params.id);

  if (!trip) {
    return res.status(400).json({
      message: "Invalid Trip ID",
    });
  }

  if (req.user.id !== trip.driver_id) {
    return res.status(401).json({
      message: "Driver cannot start this trip",
    });
  }
  if (trip.started) {
    return res.status(400).json({
      message: "Trip already started",
    });
  }
  if (trip.completed) {
    return res.status(400).json({
      message: "Trip completed",
    });
  }

  await Promise.all([
    Trip.start(req.params.id),
    Driver.setCurrentTrip(req.user.id, trip.id),
  ]);

  res.sendStatus(200);
});

export const endTrip = route(async (req, res) => {
  const trip = await Trip.findTripDetails(req.params.id);

  if (!trip) {
    return res.status(400).json({
      message: "Invalid Trip ID",
    });
  }

  if (req.user.id !== trip.driver_id) {
    return res.status(401).json({
      message: "Driver cannot end this trip",
    });
  }
  if (trip.completed) {
    return res.status(400).json({
      message: "Trip already ended",
    });
  }
  if (!trip.started) {
    return res.status(400).json({
      message: "Trip hasn't started",
    });
  }

  await Promise.all([
    Trip.end(req.params.id),
    Driver.completeTrip(req.user.id),
    User.removeBalance(trip.user_id, trip.fare),
  ]);

  res.sendStatus(200);
});

export const bookTrip = route(async (req, res) => {
  const fare = getCostToCoverDistance(
    getDistanceBetweenCoords(req.body.source, req.body.destination)
  );

  if (req.user.walletBalance < fare) {
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const drivers = await getAvailableDrivers(req.body.source);

  let driverId = req.query.driverId;

  if (!driverId) {
    let minDistance = drivers[0].timeToLocation;
    driverId = drivers[0].id;
    drivers.forEach((driver) => {
      if (driver.timeToLocation < minDistance) {
        minDistance = driver.timeToLocation;
        driverId = driver.id;
      }
    });
  }

  if (
    !drivers.map((driver) => driver.id).includes(parseInt(driverId as string))
  ) {
    return res.status(400).json({
      message: "Cannot book this driver",
    });
  }

  await Trip.insert([
    driverId,
    req.user.id,
    req.body.source.x_coordinate,
    req.body.source.y_coordinate,
    req.body.destination.x_coordinate,
    req.body.destination.y_coordinate,
    false,
    false,
    fare,
  ]);

  await Driver.setGoingToUser(driverId as string);

  res.status(200).json({});
});

export const getAvailableCabs = route(async (req, res) => {
  const drivers = await getAvailableDrivers(req.body.location);

  res.status(200).json({
    data: drivers.map((driver) => ({ ...driver, password: undefined })),
  });
});

const getAvailableDrivers = async (location: Coordinate) => {
  let drivers = await Trip.findNearbyCabs(location);
  if (drivers.map((driver) => !driver.currentTrip_id).length === 0)
    drivers = await Trip.findNearbyCabs(location, true);
  // Warning: Drivers who are nearby and close to completing thier trip are not accounted for

  drivers = drivers.map((driver) => {
    let timeToLocation = -1;
    if (!driver.currenttrip_id) {
      timeToLocation = getTimeToCoverDistance(
        getDistanceBetweenCoords(
          {
            x_coordinate: driver.currentlocation_x,
            y_coordinate: driver.currentlocation_y,
          },
          location
        )
      );
    } else {
      const driverCurrentDestination = {
        x_coordinate: driver.destination_x,
        y_coordinate: driver.destination_y,
      };

      console.log(
        getTimeToCoverDistance(
          getDistanceBetweenCoords(driverCurrentDestination, location)
        )
      );

      timeToLocation =
        getTimeToCoverDistance(
          getDistanceBetweenCoords(
            {
              x_coordinate: driver.currentlocation_x,
              y_coordinate: driver.currentlocation_y,
            },
            driverCurrentDestination
          )
        ) +
        getTimeToCoverDistance(
          getDistanceBetweenCoords(driverCurrentDestination, location)
        );
    }

    return { ...driver, timeToLocation };
  });

  return drivers.map((driver) => ({
    id: driver.id,
    name: driver.name,
    email: driver.email,
    rating: driver.rating,
    currentlyInTrip: !!driver.currenttrip_id,
    tripscompleted: driver.tripscompleted,
    currentlocation_x: driver.currentlocation_x,
    currentlocation_y: driver.currentlocation_y,
    timeToLocation: driver.timeToLocation,
  }));
};
