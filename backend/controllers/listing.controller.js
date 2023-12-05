

import express from 'express';
import { errorHandler } from "../utils/error.js";
import Listing from '../models/listing.model.js';

const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(200).json(listing);
    } catch (err) {
        next(err);
    }
};

export default createListing;