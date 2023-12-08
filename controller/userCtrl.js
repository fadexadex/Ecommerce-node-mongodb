import { generateToken } from "../config/jwtToken.js";
import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";

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
    const { id } = req.user;
    const findAUser = await User.findById(id);
    res.json(findAUser);
  } catch (error) {
    throw new Error(error);
  }
});

//Update a User
export const updateAUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateUser = await User.findByIdAndUpdate(
      id,
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

//Delete a User
export const deleteAUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteAUser = await User.findByIdAndDelete(id);
    res.json(deleteAUser);
  } catch (error) {
    throw new Error(error);
  }
});
