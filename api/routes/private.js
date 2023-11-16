const express = require("express");
const router = express.Router();
const videoModel = require("../models/videoModel");
const { getUserDetails } = require("../functions/userManagement/userDetails");
const mongoose = require("mongoose");
const {
  getTrendingVideos,
} = require("../functions/videoManagement/trendingVideos");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "This is a private area",
  });
});

router.get("/video/my", async (req, res, next) => {
  const token = req.headers.authorization;
  const user = await getUserDetails(token);
  if (user) {
    const userId = user._id;
    videoModel
      .find({ uploader: userId })
      .exec()
      .then((videos) => {
        res.status(200).json({
          videos: videos,
        });
      })
      .catch((err) => {
        // Handle error
        console.error(err);
        res.status(500).json({
          message: err,
        });
      });
  }
});

router.get("/home", async (req, res, next) => {
  const videos = await getTrendingVideos();
  return res.status(200).json({
    trending: videos,
  });
});

router.post("/video/upload", async (req, res, next) => {
  try {
    const data = req.body.data;
    const videoUrl = req.body.video;
    const posterUrl = req.body.poster;
    const token = req.headers.authorization;

    if (!data) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Missing video data in the request body",
      });
    }

    const user = await getUserDetails(token);

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid or expired token",
      });
    }

    const newVideo = new videoModel({
      _id: new mongoose.Types.ObjectId(),
      title: data.title,
      desc: data.desc,
      tags: data.tags,
      privacy: data.privacy,
      video: [
        {
          size: "1080p",
          url: videoUrl.url,
          firebaseUrl: videoUrl.url.firebaseUrl,
        },
      ],
      poster: [
        {
          size: "large",
          url: posterUrl.url,
          firebaseUrl: posterUrl.url.firebaseUrl,
        },
      ],
      uploader: user._id,
    });

    const dbres = await newVideo.save();

    if (dbres) {
      return res.status(200).json({
        message: "Details Added",
        id: dbres._id,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing the request",
    });
  }
});

module.exports = router;
