import User from "../Model/User.js";
import upload from "../utils/multer.js";

export const updateUser = async (req, res, next) => {
  console.log("body", { ...req.body });
  try {
    upload.single("photos")(req, res, async function (err) {
      if (err) {
        console.error("Error uploading images:", err);
        return res.status(500).json({ error: "Error uploading images" });
      }

      try {
        const photos = req.file;

        console.log("Uploaded photos:", photos.path);
        console.log("Request Body : ", req.body);

        const newUser = new User({
          ...req.body,
          photos: photos.path,
          // ||photos,
        });

        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
      } catch (error) {
        console.error("Error creating hotel:", error);
        res.status(500).json({ error: "Error creating hotel" });
      }
    });
  } catch (err) {
    console.error("Error in createHotel:", err);
    next(err);
  }
};
export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    const { password, ...deletedUserDetails } = deletedUser._doc;
    res.status(200).json({
      message: "User has been deleted.",
      userDetails: { ...deletedUserDetails },
    });
  } catch (err) {
    next(err);
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
