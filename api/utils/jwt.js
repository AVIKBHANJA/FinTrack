import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, "Access denied. No token provided."));
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return next(errorHandler(401, "Invalid token."));
  }
};
