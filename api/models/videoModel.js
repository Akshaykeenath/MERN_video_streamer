const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  desc: String,
  tags: [String],
  privacy: String,
  video: [
    {
      size: String, // Size of the video (e.g., "1080p")
      url: String, // URL for the video
      firebaseUrl: String,
    },
  ],
  poster: [
    {
      size: String, // Size of the poster (e.g., "small")
      url: String, // URL for the poster
      firebaseUrl: String,
    },
  ],
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userdata", // Reference the userdata model
  },
  likes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "userdata" },
      type: { type: String, enum: ["like", "dislike"] },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "userdata" },
      text: { type: String },
      likes: { type: Number, default: 0 },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  views: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "userdata" },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("videoData", videoSchema);
