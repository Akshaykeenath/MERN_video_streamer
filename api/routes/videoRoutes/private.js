const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  getUserDetails,
} = require("../../functions/userManagement/userDetails");
const videoModel = require("../../models/videoModel");
const {
  addLikeToVideo,
  addViewToVideo,
  subscribeToChannel,
  unsubscribeFromChannel,
} = require("../../functions/videoManagement/likeViewComment");
const {
  getVideoById,
  updateVideo,
  getRelatedVideos,
  getSearchVideoResults,
  getMyVideos,
  getAllVideos,
} = require("../../functions/videoManagement/videoDetails");

// current link : /private/video

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "This is video area",
  });
});

// like, comments, subscribe and views area

router.post("/like", async (req, res, next) => {
  const videoId = req.body.videoId;
  const likeType = req.body.likeType; // "like" or "dislike"
  const token = req.headers.authorization;

  try {
    const user = await getUserDetails(token);

    // Use the addLikeToVideo function from the videoService
    const result = await addLikeToVideo(videoId, user._id, likeType);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
});

router.post("/subscribe", async (req, res, next) => {
  const channelOwnerId = req.body.channelId;
  const subscribe = req.body.subscribe; // "true" or "false"
  const token = req.headers.authorization;

  try {
    const user = await getUserDetails(token);
    let result = "";
    if (subscribe == "true") {
      result = await subscribeToChannel(channelOwnerId, user._id);
    } else {
      result = await unsubscribeFromChannel(channelOwnerId, user._id);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
});

// Video management Routes
router.get("/my", async (req, res, next) => {
  const token = req.headers.authorization;
  const user = await getUserDetails(token);
  if (user) {
    try {
      const videos = await getMyVideos(user);
      res.status(200).json({
        videos: videos,
      });
    } catch (err) {
      // Handle error
      res.status(500).json({
        message: err.message || "Internal Server Error",
      });
    }
  }
});

router.get("/all", async (req, res, next) => {
  try {
    const videos = await getAllVideos();
    if (videos) {
      return res.status(200).json({
        allVideos: videos,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err,
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

router.get("/watch/id/:videoId", async (req, res) => {
  const videoId = req.params.videoId;
  const token = req.headers.authorization;
  const user = await getUserDetails(token);

  try {
    const video = await videoModel.findById(videoId).populate({
      path: "uploader",
      model: "userdata",
      select: "fname lname uname email channel",
    });

    if (!video) {
      return res.status(404).json({
        error: "Not Found",
        message: "Video not found",
      });
    }
    const viewRes = addViewToVideo(videoId, user._id);
    const userInteraction = video.likes.find(
      (like) => like.user.toString() === user._id.toString()
    );
    const isSubscribed = video.uploader.channel.subscribers.some(
      (subscriber) => String(subscriber.user) === String(user._id)
    );
    const isOwner = video.uploader._id.toString() == user._id;
    const userLiked = userInteraction ? userInteraction.type : false;
    const userViews = video.views.length + 1;
    const modifedVideo = {
      _id: video._id,
      comments: video.comments,
      desc: video.desc,
      poster: video.poster,
      privacy: video.privacy,
      tags: video.tags,
      timestamp: video.timestamp,
      title: video.title,
      uploader: {
        channel: {
          img: video.uploader.channel.img,
          subscribers: video.uploader.channel.subscribers.length,
        },
        _id: video.uploader.id,
        fname: video.uploader.fname,
        lname: video.uploader.lname,
        uname: video.uploader.uname,
      },
      video: video.video,
      views: userViews,
      likeType: userLiked,
      likes: video.likesCount,
      dislikes: video.dislikesCount,
      isSubscribed: isSubscribed,
      isOwner: isOwner,
    };

    res.status(200).json({
      video: modifedVideo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing the request",
    });
  }
});

router.get("/related/id/:videoId", async (req, res) => {
  const videoId = req.params.videoId;
  try {
    if (videoId) {
      const relatedVideos = await getRelatedVideos(videoId);
      res.status(200).json({ message: relatedVideos });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing the request",
    });
  }
});

router.get("/id/:videoId", async (req, res) => {
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

router.delete("/id/:videoId", async (req, res, next) => {
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

router.post("/update", async (req, res, next) => {
  const video = req.body.video;
  const token = req.headers.authorization;
  try {
    if (video) {
      const user = await getUserDetails(token);
      const orginalVideo = await getVideoById(video.id);
      if (orginalVideo.uploader.toString() === user._id.toString()) {
        const updatedVideo = await updateVideo(video.id, video);
        if (updatedVideo) {
          res.status(200).json({
            user: user,
            video: updatedVideo,
          });
        } else {
          throw new Error("Failed to update video");
        }
      } else {
        res.status(403).json({
          message: "user not permitted to update",
          user: user,
          video: orginalVideo,
        });
      }
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

// search routes

router.post("/search/results", async (req, res, next) => {
  const searchQuery = req.body.searchQuery;
  try {
    if (searchQuery) {
      const videos = await getSearchVideoResults(searchQuery);
      res.status(200).json({ message: videos });
    } else {
      res.status(400).json({ message: "search query not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
