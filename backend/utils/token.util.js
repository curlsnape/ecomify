import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/config.js";

export function generateAccessToken(user) {
  return jwt.sign({ id: user._id }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
  });
}

export function generateRefreshToken(user) {
  return jwt.sign({ id: user._id }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
  });
}

export function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}
