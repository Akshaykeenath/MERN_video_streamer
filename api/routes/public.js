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

router.get("/home", async (req, res, next) => {
  const videos = await getTrendingVideos();
  return res.status(200).json({
    trending: videos,
  });
});

module.exports = router;
