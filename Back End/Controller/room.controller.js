import Room from "../Model/room.model.js";
import Hotel from "../Model/hotel.Model.js";
//import { CreateError } from "../Utils/Error.js";
import mongoose from "mongoose";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

//UPDATE
export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};
//DELETE
export const deleteRoom = async (req, res, next) => {
  const roomId = req.params.roomid;
  const hotelId = req.params.hotelid;

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    res.status(400).json({
      status: false,
      message: `Hotel ID ${roomId} does not matched`,
    });
  }
  try {
    const deletedRoom = await Room.findByIdAndDelete(roomId);

    if(!deletedRoom){
      return res.status(404).json({message: "room not found"})
    }
    //Remove the room from the hotel room array
    await Hotel.findByIdAndUpdate(
      hotelId,
      { $pull: { rooms: { _id: deletedRoom._id }} },
    );
    res.status(200).json({
      status: true,
      message: `Room ID ${roomId} deleted succesfully`,
    });
  } catch (err) {
    console.error(err);p
    next(err);
  }
};

//GET ROOM
// export const getRoom = async (req, res, next) => {
//   const RoomId = req.params.id;
//   //check the room id with database id
//   if (!mongoose.Types.ObjectId.isValid(RoomId)) {
//     res
//       .status(400)
//       .json({ status: false, message: `Your Room ID ${RoomId} does'nt match` });
//   }
//   try {
//     const room = await Room.findById(req.params.id);
//     res.status(200).json({
//       status: true,
//       message: `Room ID matched`,
//       date: room,
//     });
//   } catch (err) {
//     next(err);
//   }
// };