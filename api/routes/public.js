const express = require("express");
const {
  getTrendingVideos,
} = require("../functions/videoManagement/trendingVideos");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "This is public area",
  });
});

module.exports = router;
