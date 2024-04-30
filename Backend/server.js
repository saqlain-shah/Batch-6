import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import usersRoute from "./Routes/user.routes.js";
import authRoute from "./Routes/AuthRoutes.js";
import HotelRoute from "./Routes/hotel.routes.js";
import roomRoute from "./Routes/room.routes.js";

const app = express();

dotenv.config();

// Middlewares
const corsOptions = {
  credentials: true,
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));
// Specify the allowed origin
app.use(cookieParser());
app.use(express.json());

const DatabaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to mongoDB.");
  } catch {
    console.log("Connection Error");
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB Disconnected!");
});

app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

const port = process.env.PORT || 9000;

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotel", HotelRoute);
app.use("/api/room", roomRoute);
app.listen(port, () => {
  DatabaseConnection();
  console.log(`Server Listen on port ${port}`);
  console.log("Connected to backend.");
});
