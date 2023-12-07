import express from "express";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) return next(errorHandler(404, "Listing not found"));
  if (req.user.id === listing.userRef) {
    try {
      await Listing.findByIdAndDelete(listing._id);
      res.status(200).json("deleted listing successfully");
    } catch (err) {
      next(err);
    }
  }
  return next(errorHandler(401, "Log in to delete listing"));
};

export const editListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing not found"));

  if (req.user.id === listing.userRef) {
    try {
      const updated_listing = await Listing.findByIdAndUpdate(
        listing._id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updated_listing);
    } catch (err) {
      next(err);
    }
  }
  return next(errorHandler(401, "Log in before you edit a listing"));
};

export const getListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }

  if (req.user.id === listing.userRef) {
    try {
      const getListing = await Listing.findById(listing._id);
      res.status(200).json(getListing);
    } catch (err) {
      next(err);
    }
  }
  return next(errorHandler(401, "log in to get listing"));
};
