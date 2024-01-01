const VideoModel = require("../../models/videoModel");

async function getTrendingVideos(duration = "recent") {
  const tVideos = await VideoModel.find({ privacy: "public" })
    .populate({
      path: "uploader",
      model: "userdata",
      select: "fname lname uname email channel",
    })
    .exec();

  let newVideos = [];

  tVideos.forEach((vid) => {
    const newVid = {
      _id: vid._id,
      poster: vid.poster,
      timestamp: vid.timestamp,
      uploader: vid.uploader,
      video: vid.video,
      viewsCount: vid.viewsCount,
      title: vid.title,
      desc: vid.desc,
      trendingScore: vid.trendingScore,
      trendingScoreAllTime: vid.trendingScoreAllTime,
    };
    newVideos.push(newVid);
  });

  // Sort the newVideos array based on trendingScore in descending order
  if (duration === "recent") {
    newVideos.sort((a, b) => b.trendingScore - a.trendingScore);
  } else {
    newVideos.sort((a, b) => b.trendingScoreAllTime - a.trendingScoreAllTime);
  }
  // Take only the top 10 videos
  const top6Videos = newVideos.slice(0, 6);
  return top6Videos;
}

module.exports = { getTrendingVideos };
