import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  updateRoomAvailability,
} from "../Controller/room.controller.js";
import { verifyAdmin } from "../Utils/verifyToken.js";

const router = express.Router();
//CREATE
router.post("/:hotelid", createRoom);

//UPDATE
router.put("/availability/:id", updateRoomAvailability);
router.put("/:id", verifyAdmin, updateRoom);
//DELETE
router.delete("/:id/:hotelid", verifyAdmin, deleteRoom);
//GET

router.get("/:id", getRoom);
//GET ALL

router.get("/", getRooms);

export default router;