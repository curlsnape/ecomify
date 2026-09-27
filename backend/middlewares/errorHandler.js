export function errorHandler(err, req, res, next) {
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  if (err.code === 11000) {
    return res
      .status(409)
      .json({ message: "A record with this value already exists" });
  }

  console.error(err);
  return res.status(500).json({ message: "Something went wrong" });
}
