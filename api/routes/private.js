const express = require("express");
const router = express.Router();
const profileRoutes = require("./profileRoutes/profileRoutes");
const videoRoutes = require("./videoRoutes/private");

const {
  getTrendingVideos,
} = require("../functions/videoManagement/trendingVideos");
const {
  getChannelDataById,
  getDashboardData,
} = require("../functions/userManagement/channelDetails");
const { getUserDetails } = require("../functions/userManagement/userDetails");
const {
  getSubscribedChannels,
  getSubscribedVideos,
} = require("../functions/videoManagement/videoDetails");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "This is a private area",
  });
});

router.get("/myhome", async (req, res, next) => {
  const token = req.headers.authorization;
  const videos = await getTrendingVideos();
  let subscribedChannels, subscribedVideos;
  try {
    const user = await getUserDetails(token);
    if (user) {
      subscribedChannels = await getSubscribedChannels(user._id);
      subscribedVideos = await getSubscribedVideos(user._id);
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }

  return res.status(200).json({
    trending: videos,
    subscribedChannels: subscribedChannels,
    subscribedVideos: subscribedVideos,
  });
});

router.get("/mysubscriptions", async (req, res, next) => {
  const token = req.headers.authorization;
  let subscribedChannels, subscribedVideos;
  try {
    const user = await getUserDetails(token);
    if (user) {
      subscribedChannels = await getSubscribedChannels(user._id);
      subscribedVideos = await getSubscribedVideos(user._id);
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
  return res.status(200).json({
    subscribedChannels: subscribedChannels,
    subscribedVideos: subscribedVideos,
  });
});

router.get("/mydashboard", async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const user = await getUserDetails(token);
    if (user) {
      const data = await getDashboardData(user._id);
      res.status(200).json({
        message: data,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
});

router.get("/channel/watch/:channelId", async (req, res, next) => {
  const channelId = req.params.channelId;
  const token = req.headers.authorization;
  try {
    const user = await getUserDetails(token);
    if (!channelId || !user) {
      return res.status(400).json({
        message: "Channel Id or user not found in request",
      });
    }

    const data = await getChannelDataById(channelId, user._id);

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
