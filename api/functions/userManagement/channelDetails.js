const userModel = require("../../models/userModel");
const videoModel = require("../../models/videoModel");

async function getChannelDataById(channelId, userId) {
  try {
    if (channelId && userId) {
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
        const isSubscribed = user.channel.subscribers.some(
          (subscriber) => String(subscriber.user) === String(userId)
        );
        const isOwner = user._id.toString() == String(userId);
        const data = {
          channel: {
            title: user.fname + " " + user.lname,
            img: user.channel.img[0]?.url,
            uname: user.uname,
            videos: newVideos.length,
            _id: user._id,
            subscribers: user.channel.subscribers.length,
            isSubscribed: isSubscribed,
            isOwner: isOwner,
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
