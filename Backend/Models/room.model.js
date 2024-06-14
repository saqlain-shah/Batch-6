import mongoose from "mongoose";
const RoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    photos: {
      type: String,
    },

    price: {
      type: Number,
    },
    maxPeople: {
      type: Number,
    },
    desc: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);
