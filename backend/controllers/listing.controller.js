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

  try {
    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = req.query.limit || 9;
    const startIndex = req.query.startIndex || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === false) {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === false) {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === false) {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sale"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
};
