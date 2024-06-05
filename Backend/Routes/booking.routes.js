import express from "express";
import {
  createBooking,
  bookingList,
//   bookingSearch,
  checkOut,
} from "../Controller/booking.controller.js";
// import { verifyUser } from "../utils/verifyToken.js";
const router = express.Router();
//Check In
router.post("/:hotelId/:roomId", createBooking);
//Booking List
router.get("/", bookingList);
//Search Booking By Id
// router.get("/search/:id", verifyUser, bookingSearch);
//Check Out
router.delete("/:id", checkOut);

export default router;