import User from "../Models/user.model.js";

export const updateUser = async (req, res, next) => {
  try {
    // Handle file upload
    upload.single("photos")(req, res, async function (err) {
      if (err) {
        console.error("Error uploading images:", err);
        return res.status(500).json({ error: "Error uploading images" });
      }

      try {
        const photos = req.file;
        console.log("Uploaded photos:", photos.path);
        console.log("Request Body : ", req.body);

        // Create or update user
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { $set: { ...req.body, photos: photos.path } },
          { new: true }
        );

        if (!updatedUser) {
          return res.status(404).send({
            success: false,
            message: "User not found.",
          });
        }

        const { password, ...userData } = updatedUser._doc;

        res.status(200).send({
          success: true,
          message: "User has been updated successfully.",
          user: userData,
        });
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Error updating user" });
      }
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).send({
      success: true,
      message: "User has been deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    const { password, ...userData } = user._doc;

    res.status(200).send({
      success: true,
      message: "User has been displayed successfully.",
      user: userData,
    });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    console.log("get users api triggered");

    // Exclude password field from all user data
    const allUsers = users.map((user) => {
      const { password, ...userData } = user._doc;
      return userData;
    });
    res.status(200).json({
      success: true,
      message: "All the users have been displayed successfully.",
      users: allUsers,
    });
  } catch (err) {
    next(err);
  }
};
