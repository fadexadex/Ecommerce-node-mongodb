import { generateToken } from "../config/jwtToken.js";
import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../utils/validateMongodbId.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import jwt from "jsonwebtoken";

//createUser
export const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    //Create a new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    //User already exists
    throw new Error("User already exists");
  }
});

//Login user
export const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Check if user exists with this email
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      id: findUser?._id,
      firstname: findUser?.firstname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

//Get a single user
export const getAUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const findAUser = await User.findById(id);
    res.json(findAUser);
  } catch (error) {
    throw new Error(error);
  }
});

//Update a User
export const updateAUser = asyncHandler(async (req, res) => {
  try {
    const { _id } = await req.user;
    validateMongoDbId(_id);
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      { new: true }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

//Block a user
export const blockUser = asyncHandler(
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      validateMongoDbId(id);
      await User.findByIdAndUpdate(
        id,
        {
          isBlocked: true,
        },
        { new: true }
      );
      res.json("User Blocked");
    } catch (error) {
      throw new Error(error);
    }
  })
);

//Unblock User
export const unblockUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    res.json("User Unblocked");
  } catch (error) {
    throw new Error(error);
  }
});

//Delete a User
export const deleteAUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const deleteAUser = await User.findByIdAndDelete(id);
    res.json(deleteAUser);
  } catch (error) {
    throw new Error(error);
  }
});

//logout functionality
export const logOut = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("No Refresh Token In Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); //Forbidden
  }
  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); //Forbidden
});

export const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token In cookies");
  const refreshToken = cookie?.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No user with refresh token present in db ");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id)
      throw new Error("Something is Wrong with the refresh token");
  });
  const accessToken = generateToken(user?._id);
  res.json(accessToken);
});
