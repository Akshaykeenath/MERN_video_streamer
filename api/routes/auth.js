const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
} = require("../functions/encrypt");
const {
  sendVerificationMail,
} = require("../functions/verification/emailVerification");
const { getUserDetails } = require("../functions/userManagement/userDetails");

router.post("/login", (req, res) => {
  const user = {
    uname: req.body.uname,
    pass: req.body.pass,
    rememberMe: req.body.rememberMe,
  };
  console.log(user);
  userModel
    .findOne({ $or: [{ uname: user.uname }, { email: user.uname }] })
    .then(async (existingUser) => {
      console.log(existingUser);
      if (existingUser) {
        const isMatch = await verifyPassword(user.pass, existingUser.password);
        if (isMatch) {
          // User is authenticated
          if (existingUser.verified) {
            jwtToken = generateToken(existingUser, user.rememberMe);
            res.status(200).json({
              message: "success",
              token: jwtToken,
            });
          } else {
            res.status(401).json({
              message: "Verify mail id first",
            });
          }
        } else {
          res.status(401).json({
            message: "Invalid credentials",
          });
        }
      } else {
        res.status(401).json({
          message: "Invalid credentials",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/", (req, res) => {
  const token = req.headers.authorization;
  const response = verifyToken(token);
  if (response.error) {
    res.status(401).json({
      error: "not authorised",
    });
  } else {
    res.status(200).json({
      message: "authorised",
    });
  }
});

router.post("/verify/email", async (req, res) => {
  try {
    const token = req.body.token;
    const user = await getUserDetails(token);
    console.log(user);

    if (!user) {
      // Handle the case where the user is not found
      return res.status(404).json({
        message: "Invalid / Expired Link",
      });
    }

    if (!user.verified) {
      // Check if the 'verified' field is not already true
      const updateStatus = await userModel.findByIdAndUpdate(
        user._id,
        { verified: true },
        { new: true }
      );

      if (updateStatus) {
        res.status(200).json({
          message: "Mail ID Verified Successfully",
        });
      } else {
        // Handle the case where the update failed
        res.status(500).json({
          message: "Mail Id Verification Failed",
        });
      }
    } else {
      // Handle the case where the user is already verified
      res.status(200).json({
        message: "Mail ID is already verified",
      });
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/register", async (req, res) => {
  const frontendUrl = req.get("Referer");
  const user = {
    fname: req.body.fname,
    lname: req.body.lname,
    uname: req.body.uname,
    mobile: req.body.mobile,
    pass: req.body.pass,
    email: req.body.email,
  };

  try {
    const existingUser = await userModel.findOne({
      $or: [
        { uname: user.uname },
        { email: user.email },
        { mobile: user.mobile },
      ],
    });

    if (existingUser) {
      res.status(400).json({
        error: "User already exists with the same email or username or mobile.",
      });
    } else {
      const hashedPassword = await hashPassword(user.pass);
      const newUser = new userModel({
        _id: new mongoose.Types.ObjectId(),
        fname: user.fname,
        lname: user.lname,
        uname: user.uname,
        mobile: user.mobile,
        email: user.email,
        password: hashedPassword,
        verified: false,
      });

      await newUser.save();
      const response = await sendVerificationMail(newUser, frontendUrl);
      if (response.status !== 200) {
        throw new Error(response.message);
      }
      res.status(200).json({
        message: "User added. Verify your mail ID",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err,
    });
  }
});

router.post("/check/uname", async (req, res, next) => {
  const uname = req.body.uname;
  try {
    if (uname) {
      if (!/^[a-zA-Z][a-zA-Z0-9@.]+$/.test(uname)) {
        res.status(400).json({
          message:
            "Invalid username format. Username can only contain alphabets , numbers and @.",
        });
        return;
      }

      const existingUser = await userModel.findOne({ uname: uname });
      if (existingUser) {
        res.status(409).json({ message: "Username already in use" });
      } else {
        res.status(200).json({
          message: "Username available",
          uname: uname,
        });
      }
    } else {
      res.status(400).json({ message: "Username not found in the request" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
});

module.exports = router;
