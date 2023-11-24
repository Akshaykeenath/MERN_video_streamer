const VideoModel = require("../../models/videoModel");
async function getTrendingVideos() {
  const tVideos = await VideoModel.find({ privacy: "public" })
    .limit(10)
    .select("_id title video poster uploader timestamp viewsCount views")
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
      des: vid.desc,
    };
    newVideos.push(newVid);
  });
  return newVideos;
}

module.exports = { getTrendingVideos };
