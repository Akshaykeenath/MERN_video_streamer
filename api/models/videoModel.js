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

// Virtual property to get views count
videoSchema.virtual("viewsCount").get(function () {
  return (this.views && this.views.length) || 0;
});

// Virtual property to get likes count
videoSchema.virtual("likesCount").get(function () {
  return (
    (this.likes && this.likes.filter((like) => like.type === "like").length) ||
    0
  );
});

// virtual property to get trending score
videoSchema.virtual("trendingScoreAllTime").get(function () {
  return this.likesCount + this.viewsCount - this.dislikesCount;
});
videoSchema.virtual("trendingScore").get(function () {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const likesLast30Days = this.likes.filter(
    (like) => like.timestamp >= thirtyDaysAgo && like.type === "like"
  );

  const dislikesLast30Days = this.likes.filter(
    (like) => like.timestamp >= thirtyDaysAgo && like.type === "dislike"
  );

  const viewsLast30Days = this.views.filter(
    (view) => view.timestamp >= thirtyDaysAgo
  );

  return (
    likesLast30Days.length + viewsLast30Days.length - dislikesLast30Days.length
  );
});

// Virtual property to get dislikes count
videoSchema.virtual("dislikesCount").get(function () {
  return (
    (this.likes &&
      this.likes.filter((like) => like.type === "dislike").length) ||
    0
  );
});

// Apply the virtuals to JSON output
videoSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("videoData", videoSchema);
