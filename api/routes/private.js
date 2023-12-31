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
  getAnalyticsDataChannel,
  getAnalyticsDataVideo,
} = require("../functions/userManagement/channelDetails");
const { getUserDetails } = require("../functions/userManagement/userDetails");
const {
  getSubscribedChannels,
  getSubscribedVideos,
  getMyLikedVideos,
} = require("../functions/videoManagement/videoDetails");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "This is a private area",
  });
});

router.get("/myhome", async (req, res, next) => {
  let videos;
  try {
    videos = await getTrendingVideos();
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
  return res.status(200).json({
    trending: videos,
  });
});

router.get("/mytrending", async (req, res, next) => {
  let videosRecent, videosAlltime;
  try {
    videosRecent = await getTrendingVideos();
    videosAlltime = await getTrendingVideos("alltime");
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
  return res.status(200).json({
    trendingRecent: videosRecent,
    trendingAlltime: videosAlltime,
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

router.get("/mylikedvideos", async (req, res, next) => {
  const token = req.headers.authorization;
  let subscribedChannels, subscribedVideos;

  try {
    const user = await getUserDetails(token);
    if (!user) {
      return res.status(401).json({
        message: "Error in fetching user details",
      });
    }
    const videos = await getMyLikedVideos(user._id);

    if (videos) {
      return res.status(200).json({
        likedVideos: videos,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
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

router.get("/analytics/channel", async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const user = await getUserDetails(token);
    if (user) {
      const data = await getAnalyticsDataChannel(user._id);
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

router.get("/analytics/video/:videoId", async (req, res, next) => {
  const videoId = req.params.videoId;
  const token = req.headers.authorization;
  try {
    const user = await getUserDetails(token);
    if (videoId) {
      const data = await getAnalyticsDataVideo(videoId);
      if (String(data.videoData.uploader) !== String(user._id)) {
        res.status(400).json({
          message: "User not permited to access the video",
        });
      }
      res.status(200).json({
        message: data,
      });
    } else {
      res.status(400).json({
        message: "Video Id is not found on request",
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
