import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = await req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    throw new Error("You are not an admin");
  }
  next();
});
