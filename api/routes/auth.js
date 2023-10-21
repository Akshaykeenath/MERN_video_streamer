const express = require("express");

const router = express.Router();
const userModel = require("../models/userModel");
const mongoose = require("mongoose");

router.post("/login", (req, res) => {
  const uname = req.body.uname;
  const pass = req.body.pass;

  res.status(200).json({
    uname: uname,
    pass: pass,
  });
});

router.post("/register", (req, res) => {
  const user = {
    fname: req.body.fname,
    lname: req.body.lname,
    uname: req.body.uname,
    mobile: req.body.mobile,
    pass: req.body.pass,
    email: req.body.email,
  };

  // Check if a user with the same email or uname already exists
  userModel
    .findOne({
      $or: [
        { uname: user.uname },
        { email: user.email },
        { mobile: user.mobile },
      ],
    })
    .then((existingUser) => {
      if (existingUser) {
        res.status(400).json({
          message:
            "User already exists with the same email or username or mobile.",
        });
      } else {
        const newUser = new userModel({
          _id: new mongoose.Types.ObjectId(),
          fname: user.fname,
          lname: user.lname,
          uname: user.uname,
          mobile: user.mobile,
          email: user.email,
          password: user.pass,
        });
        newUser
          .save()
          .then((result) => {
            res.status(200).json({
              message: "User added",
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
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

module.exports = router;
