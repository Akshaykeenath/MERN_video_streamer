const userModel = require("../../models/userModel");
const videoModel = require("../../models/videoModel");

async function getChannelDataById(channelId) {
  try {
    if (channelId) {
      const user = await userModel.findById(channelId);
      const videos = await videoModel.find({
        uploader: channelId,
        privacy: "public",
      });
      let newVideos = [];
      if (videos) {
        videos.forEach((vid) => {
          const newVid = {
            _id: vid._id,
            poster: vid.poster,
            timestamp: vid.timestamp,
            video: vid.video,
            viewsCount: vid.viewsCount,
            title: vid.title,
            desc: vid.desc,
          };
          newVideos.push(newVid);
        });
      }
      if (user) {
        const data = {
          channel: {
            title: user.fname + " " + user.lname,
            img: user.channel.img[0]?.url,
            uname: user.uname,
            videos: newVideos.length,
          },
          videos: newVideos,
        };
        return { status: "success", statusCode: 200, message: data };
      } else {
        return {
          status: "error",
          statusCode: 404,
          message: "Channel not found",
        };
      }
    } else {
      return { status: "error", statusCode: 400, message: "Invalid channelId" };
    }
  } catch (err) {
    console.error("Error in getChannelDataById:", err.message);
    return {
      status: "error",
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
}

module.exports = { getChannelDataById };
