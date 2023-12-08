import express from "express";
import {
  createUser,
  deleteAUser,
  getAUser,
  getAllUsers,
  loginUserCtrl,
  updateAUser,
} from "../controller/userCtrl.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", createUser);
authRouter.post("/login", loginUserCtrl);
authRouter.get("/all-users", getAllUsers);
authRouter.get("/:id", authMiddleware, getAUser);
authRouter.delete("/:id", deleteAUser);
authRouter.put("/:id", updateAUser);

export default authRouter;
