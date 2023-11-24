const express = require("express");
const {
  getUserDetails,
  updateUser,
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

router.post("/update", async (req, res, next) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const uname = req.body.uname;
  const mobile = req.body.mobile;
  const email = req.body.email;
  const channel = req.body.channel;
  const token = req.headers.authorization;

  try {
    const user = await getUserDetails(token);
    if (uname && fname && lname && mobile) {
      if (user.email === email) {
        const updateData = {
          fname: fname,
          lname: lname,
          uname: uname,
          mobile: mobile,
        };
        if (channel) {
          updateData.channel = channel;
        }
        const updatedUser = await updateUser(user._id, updateData);
        res
          .status(200)
          .json({ message: "Updated successfully", data: updatedUser });
      } else {
        res.status(400).json({ message: "Wrong user details" });
      }
    } else {
      res.status(400).json({ message: "required datas not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
