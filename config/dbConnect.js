import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

export function dbConnect() {
  try {
    const conn = mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Database Error");
    throw new Error(error);
  }
}
