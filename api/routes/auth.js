const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const { hashPassword, verifyPassword } = require("../functions/encrypt");

router.post("/login", (req, res) => {
  const user = {
    uname: req.body.uname,
    pass: req.body.pass,
  };
  userModel
    .findOne({ uname: user.uname })
    .then((existingUser) => {
      if (existingUser && verifyPassword(user.pass, existingUser.password)) {
        // User is authenticated
        req.session.user = existingUser;
        res.status(200).json({
          message: "User authenticated",
          session: req.sessionID,
          user: req.session.user,
        });
      } else {
        res.status(401).json({
          message: "Invalid credentials",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({
          error: "Logout error",
        });
      } else {
        res.status(200).json({
          message: "Logged out successfully",
        });
      }
    });
  } else {
    res.status(401).json({
      error: "No session available",
    });
  }
});

router.get("/session", (req, res) => {
  const session = req.sessionID;
  if (session) {
    res.status(200).json({
      message: session,
    });
  } else {
    res.status(401).json({
      error: "session not available",
    });
  }
});

router.post("/register", async (req, res) => {
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
        message:
          "User already exists with the same email or username or mobile.",
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
        password: hashedPassword, // Store the hashed password in the database
      });

      await newUser.save();
      res.status(200).json({
        message: "User added",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err,
    });
  }
});

module.exports = router;
