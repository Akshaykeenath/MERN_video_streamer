const express = require("express");
const router = express.Router();
const profileRoutes = require("./profileRoutes/profileRoutes");
const videoRoutes = require("./videoRoutes/private");

const {
  getTrendingVideos,
} = require("../functions/videoManagement/trendingVideos");
const {
  getChannelDataById,
} = require("../functions/userManagement/channelDetails");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "This is a private area",
  });
});

router.get("/myhome", async (req, res, next) => {
  const videos = await getTrendingVideos();

  return res.status(200).json({
    trending: videos,
  });
});

router.get("/channel/watch/:channelId", async (req, res, next) => {
  const channelId = req.params.channelId;

  try {
    if (!channelId) {
      return res.status(400).json({
        message: "Channel Id not found in request",
      });
    }

    const data = await getChannelDataById(channelId);

    if (data.status) {
      return res.status(data.statusCode).json({
        status: data.status,
        message: data.message,
      });
    } else {
      throw new Error("Unexpected error occurred");
    }
  } catch (err) {
    console.error("Error in getChannelDataById:", err.message);
    // Handle other unexpected errors
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

router.use("/profile", profileRoutes);
router.use("/video", videoRoutes);

module.exports = router;
