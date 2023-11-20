const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  getUserDetails,
} = require("../../functions/userManagement/userDetails");
const videoModel = require("../../models/videoModel");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "This is video area",
  });
});

// Video Routes
router.get("/my", async (req, res, next) => {
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
router.post("/upload", async (req, res, next) => {
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
          firebaseUrl: videoUrl.firebaseUrl,
        },
      ],
      poster: [
        {
          size: "large",
          url: posterUrl.url,
          firebaseUrl: posterUrl.firebaseUrl,
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

router.get("/:videoId", async (req, res) => {
  const videoId = req.params.videoId;

  try {
    const video = await videoModel.findById(videoId).populate({
      path: "uploader",
      model: "userdata",
      select: "fname lname uname email",
    });

    if (!video) {
      return res.status(404).json({
        error: "Not Found",
        message: "Video not found",
      });
    }

    res.status(200).json({
      video: video,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing the request",
    });
  }
});

router.delete("/:videoId", async (req, res, next) => {
  const token = req.headers.authorization;
  const user = await getUserDetails(token);

  const userId = user._id;
  const videoId = req.params.videoId;

  videoModel
    .findOneAndDelete({ _id: videoId, uploader: userId })
    .exec()
    .then((result) => {
      if (result) {
        return res.status(200).json({
          message: "Video deleted successfully",
        });
      } else {
        return res.status(404).json({
          error: "Not Found",
          message: "Video not found or user does not have permission to delete",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        error: "Internal Server Error",
        message: "An error occurred while processing the request",
      });
    });
});

module.exports = router;
