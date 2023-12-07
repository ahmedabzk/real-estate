import express from "express";
import { updateUser,deleteUser, userListings } from "../controllers/user.controller.js";

import verifyToken from '../utils/verify.js';

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, userListings);

export default router;