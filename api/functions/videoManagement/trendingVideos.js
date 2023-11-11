const VideoModel = require("../../models/videoModel");
function getTrendingVideos() {
  const tVideos = VideoModel.find({ privacy: "public" })
    .limit(10)
    .populate({
      path: "uploader",
      model: "userdata",
      select: "fname lname uname email",
    })
    .exec();

  return tVideos;
}

module.exports = { getTrendingVideos };
