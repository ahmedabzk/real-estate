import express from "express";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";

export const updateUser = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
          },
        },
        { new: true }
      );

      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (err) {
      next(err);
    }
  }
  return next(errorHandler(401, "user.id and params.id are not equal"));
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie("access_token");
      res.status(200).json("user deleted successfully");
    } catch (err) {
      next(err);
    }
  }
  return next(errorHandler(403, "you can only delete your own account"));
};

export const userListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {

    try {
      const listing = await Listing.find({ userRef: req.params.id});
      res.status(200).json(listing);
    } catch (err) {
      next(err);
    }
  }
  return next(errorHandler(401, "Log in to get your listing"));
};
