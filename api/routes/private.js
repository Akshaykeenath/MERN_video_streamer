const express = require("express");
const router = express.Router();
const profileRoutes = require("./profileRoutes/profileRoutes");
const videoRoutes = require("./videoRoutes/private");

const {
  getTrendingVideos,
} = require("../functions/videoManagement/trendingVideos");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "This is a private area",
  });
});

router.get("/home", async (req, res, next) => {
  const videos = await getTrendingVideos();
  return res.status(200).json({
    trending: videos,
  });
});

router.use("/profile", profileRoutes);
router.use("/video", videoRoutes);

module.exports = router;
