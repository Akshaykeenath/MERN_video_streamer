const userModel = require("../../models/userModel");
const { verifyToken } = require("../encrypt");

async function getUserDetails(token) {
  const userDetails = verifyToken(token);
  const userId = userDetails.userId;
  const user = await userModel.findOne({ _id: userId });
  if (user) {
    return user;
  }
}

async function updateUser(userId, updateData) {
  try {
    // Assuming `updateData` is an object containing the fields you want to update
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true } // This option ensures that the updated document is returned
    );

    return updatedUser;
  } catch (error) {
    // Handle errors appropriately
    console.error("Error updating user:", error);
    throw error;
  }
}

module.exports = { getUserDetails, updateUser };
