const express = require("express");
const {
  getUserDetails,
} = require("../../functions/userManagement/userDetails");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "This is profile area area",
  });
});

router.get("/my", async (req, res, next) => {
  const token = req.headers.authorization;
  const user = await getUserDetails(token);
  const userWithoutPassword = {
    channel: user.channel,
    _id: user._id,
    fname: user.fname,
    lname: user.lname,
    uname: user.uname,
    mobile: user.mobile,
    email: user.email,
    verified: user.verified,
    __v: user.__v,
  };
  if (user) {
    res.status(200).json({
      message: userWithoutPassword,
    });
  } else {
    res.status(404).json({
      message: "User Not Found",
    });
  }
});

module.exports = router;
