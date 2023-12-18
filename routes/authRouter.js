import express from "express";
import {
  blockUser,
  createUser,
  deleteAUser,
  getAUser,
  getAllUsers,
  handleRefreshToken,
  logOut,
  loginUserCtrl,
  unblockUser,
  updateAUser,
} from "../controller/userCtrl.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", createUser);
authRouter.post("/login", loginUserCtrl);
authRouter.get("/all-users", getAllUsers);
authRouter.get("/logout", logOut);
authRouter.get("/refresh", handleRefreshToken);
authRouter.get("/:id", authMiddleware, isAdmin, getAUser);
authRouter.delete("/:id", deleteAUser);
authRouter.put("/edit-user", authMiddleware, updateAUser);
authRouter.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
authRouter.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

export default authRouter;
