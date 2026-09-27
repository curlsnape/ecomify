import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import config from "../config/config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../utils/token.util.js";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: config.NODE_ENV === "production" ? "none" : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    return res
      .status(409)
      .json({ message: "A user with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await userModel.create({ name, email, passwordHash });

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();

  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  return res.status(200).json({
    message: "Logged in successfully",
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const refreshTokenController = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({ message: "Refresh token is missing" });
  }
  const decoded = jwt.verify(incomingRefreshToken, config.REFRESH_TOKEN_SECRET);

  const user = await userModel.findById(decoded.id);

  if (!user || !user.refreshTokenHash) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }

  if (user.refreshTokenHash !== hashToken(incomingRefreshToken)) {
    user.refreshTokenHash = null;
    await user.save();
    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
    return res
      .status(403)
      .json({ message: "Refresh token reuse detected, please log in again" });
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshTokenHash = hashToken(newRefreshToken);
  await user.save();

  res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);

  return res.status(200).json({ accessToken: newAccessToken });
});

export const logoutController = asyncHandler(async (req, res) => {
  await userModel.findByIdAndUpdate(req.user._id, { refreshTokenHash: null });

  res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);

  return res.status(200).json({ message: "Logged out successfully" });
});

export const meController = asyncHandler(async (req, res) => {
  return res.status(200).json({ user: req.user });
});
