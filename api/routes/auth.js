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

router.post("/login", (req, res) => {
  const user = {
    uname: req.body.uname,
    pass: req.body.pass,
  };

  userModel
    .findOne({ uname: user.uname })
    .then(async (existingUser) => {
      if (existingUser) {
        const isMatch = await verifyPassword(user.pass, existingUser.password);
        if (isMatch) {
          // User is authenticated
          req.session.user = existingUser;
          jwtToken = generateToken(existingUser);
          res.status(200).json({
            message: "success",
            user: req.session.user,
            token: jwtToken,
          });
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
        password: hashedPassword,
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
