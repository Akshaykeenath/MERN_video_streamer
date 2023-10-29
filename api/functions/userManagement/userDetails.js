const userModel = require("../../models/userModel");
const { verifyToken } = require("../encrypt");

async function getUserDetails(token) {
  const userDetails = await verifyToken(token);
  const userId = userDetails.userId;
  const user = await userModel.findOne({ _id: userId });
  if (user) {
    return user;
  }
}

module.exports = { getUserDetails };
