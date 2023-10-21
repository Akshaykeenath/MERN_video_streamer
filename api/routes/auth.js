const express = require("express");

const router = express.Router();

router.post("/login", (req, res) => {
  const uname = req.body.uname;
  const pass = req.body.pass;

  res.status(200).json({
    uname: uname,
    pass: pass,
  });
});

router.post("/register", (req, res) => {
  const uname = req.body.uname;
  const pass = req.body.pass;
  const email = req.body.email;

  res.status(200).json({
    uname: uname,
    pass: pass,
    email: email,
  });
});

module.exports = router;
