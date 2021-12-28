import bcrypt from "bcrypt";
import { generateToken, route } from "../utils/utilities";
import User from "../models/User";
import Driver from "../models/Driver";

export const userLogin = route(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    return res.json({
      message: "User does not exist",
    });
  }

  const check = await bcrypt.compare(password, user.password);

  if (!check) {
    return res.status(401).json({
      message: "Auth Failed",
    });
  }

  delete user.password;
  const token = generateToken({ ...user, role: "user" });

  res.status(200).send({
    success: true,
    token,
  });
});

export const userRegister = route(async (req, res) => {
  const { name, email, password } = req.body;

  const exisitngUser = await User.findByEmail(email);

  if (exisitngUser) {
    return res.json({
      message: "User already Exists",
    });
  }

  const hashedPass = await bcrypt.hash(password, 10);

  await User.insert([name, email, hashedPass]);

  res.status(200).json({
    message: "User Created Succesfully",
  });
});
export const driverLogin = route(async (req, res) => {
  const { email, password } = req.body;

  const driver = await Driver.findByEmail(email);

  if (!driver) {
    return res.json({
      message: "Driver does not exist",
    });
  }

  const check = await bcrypt.compare(password, driver.password);

  if (!check) {
    return res.status(401).json({
      message: "Auth Failed",
    });
  }

  delete driver.password;
  const token = generateToken({ ...driver, role: "driver" });

  res.status(200).send({
    success: true,
    token,
  });
});

export const driverRegister = route(async (req, res) => {
  const { name, email, password } = req.body;

  const exisitngDriver = await Driver.findByEmail(email);

  if (exisitngDriver) {
    return res.json({
      message: "Driver already Exists",
    });
  }

  const hashedPass = await bcrypt.hash(password, 10);

  await Driver.insert([name, email, hashedPass, true, 0]);

  res.status(200).json({
    message: "Driver Created Succesfully",
  });
});
