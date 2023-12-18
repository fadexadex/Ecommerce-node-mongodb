import mongoose from "mongoose";

export const validateMongoDbId = (id) => {
  const validId = mongoose.Types.ObjectId.isValid;
  if (!validId) throw new Error("This Id is Invalid or not found");
};
