import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // required: true,
      // unique: true,
    },
    lastName: {
      type: String,
      // required: true,
      // unique: true,
    },
    email: {
      type: String,
      // required: true,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    }
    
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);