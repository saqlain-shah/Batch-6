import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} from "../Controller/user.controller.js";

import { verifyAdmin, verifyToken, verifyUser } from "../Utils/verifyToken.js";

const router = express.Router();

router.get("/checkauthentication", verifyToken, (req, res, next) => {
  res.send("Hello! You are authenticated.");
});

router.get("/checkuser/:id", verifyUser, (req, res, next) => {
  res.send("Hello User! You are logged in.");
});

router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
  res.send("Hello Admin! You are logged in.");
});

// UPDATE
router.put("/:id", verifyAdmin, updateUser);

// DELETE
router.delete("/:id", verifyAdmin, deleteUser);

// GET
router.get("/:id", verifyUser, getUser);

// GET ALL
router.get("/", verifyUser, getUsers);

export default router;
