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
import upload from "../Utils/multer.js";

const router = express.Router();
//CREATE
router.post("/:hotelid", upload.single('photos'), createRoom);

//UPDATE
router.put("/availability/:id", updateRoomAvailability);
router.put("/:id/:hotelId", upload.single('photos'), updateRoom);
//DELETE
router.delete("/:id/:hotelid", deleteRoom);
//GET

router.get("/:id", getRoom);
//GET ALL

router.get("/:hotelId", getRooms);

export default router;