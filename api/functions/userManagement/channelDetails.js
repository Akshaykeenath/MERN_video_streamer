const userModel = require("../../models/userModel");
const videoModel = require("../../models/videoModel");
const { getMyVideos } = require("../videoManagement/videoDetails");

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

async function getDashboardData(userId) {
  if (userId) {
    try {
      const user = await userModel.findById(userId);
      const videoList = await getMyVideos(user);
      const videos = await videoModel.find({ uploader: userId });
      const subscribers = user.channel.subscribers;
      let totalViews = 0;
      let totalLikes = 0;

      for (const video of videos) {
        totalViews += video.viewsCount || 0;
        totalLikes += video.likesCount || 0;
      }
      const allViews = [];
      const allLikes = [];

      // Loop through each video
      videos.forEach((video) => {
        video.views.forEach((view) => {
          allViews.push(view);
        });

        video.likes.forEach((like) => {
          allLikes.push(like);
        });
      });

      // Sort the arrays based on the timestamp in ascending order
      allViews.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      allLikes.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      const data = {
        statisticsCardData: {
          subscribers: subscribers.length,
          videos: videos.length,
          totalViews: totalViews,
          totalLikes: totalLikes,
        },
        processedData: {
          likes: countLikesByDay(allLikes),
          views: countLikesByDay(allViews),
          subscribers: countLikesByDay(subscribers),
        },
        videoList: videoList.slice(0, 11),
      };

      return data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }
}

async function getAnalyticsDataChannel(userId) {
  if (userId) {
    try {
      const user = await userModel.findById(userId);
      const videoList = await getMyVideos(user);
      const videos = await videoModel.find({ uploader: userId });
      const subscribers = user.channel.subscribers;
      let totalViews = 0;
      let totalLikes = 0;

      for (const video of videos) {
        totalViews += video.viewsCount || 0;
        totalLikes += video.likesCount || 0;
      }
      const allViews = [];
      const allLikes = [];

      // Loop through each video
      videos.forEach((video) => {
        video.views.forEach((view) => {
          allViews.push(view);
        });

        video.likes.forEach((like) => {
          allLikes.push(like);
        });
      });

      // Sort the arrays based on the timestamp in ascending order
      allViews.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      allLikes.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      const data = {
        chartData: {
          likes: countLikesAndDislikesByDay(allLikes),
          views: countLikesByDay(allViews),
          subscribers: countLikesByDay(subscribers),
        },
        videoList: videoList.slice(0, 11),
      };
      return data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }
}

async function getAnalyticsDataVideo(videoId) {
  if (videoId) {
    try {
      const video = await videoModel.findById(videoId);
      if (!video) {
        throw new Error("Video not found");
      }
      const allViews = video.views ? video.views : [];
      const allLikes = video.likes ? video.likes : [];

      // Sort the arrays based on the timestamp in ascending order
      allViews.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      allLikes.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      const filteredVideo = {
        desc: video.desc,
        dislikesCount: video.dislikesCount,
        id: video.id,
        likesCount: video.likesCount,
        poster: video.poster,
        privacy: video.privacy,
        timestamp: video.timestamp,
        title: video.title,
        uploader: video.uploader,
        video: video.video,
        viewsCount: video.viewsCount,
        _id: video._id,
      };
      const data = {
        chartData: {
          likes: countLikesAndDislikesByDay(allLikes),
          views: countLikesByDay(allViews),
        },
        videoData: filteredVideo,
      };
      return data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }
}

function countLikesByDay(data) {
  // Create an object to store counts for each day
  const dayCounts = {};
  if (data.length === 0) {
    return null;
  }

  // Loop through the data and count likes for each day
  data.forEach((item) => {
    const date = new Date(item.timestamp).toISOString().split("T")[0];

    if (!dayCounts[date]) {
      dayCounts[date] = 1;
    } else {
      dayCounts[date]++;
    }
  });

  // Get the range of dates from the first day to today
  const startDate = getMinDate(dayCounts);
  const endDate = new Date();

  // Create an array with counts for each day, filling in missing days with 0
  const result = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const count = dayCounts[dateStr] || 0;

    result.push({ date: dateStr, count });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

// Helper function to get the minimum date from a set of dates
function getMinDate(dateSet) {
  const dates = Object.keys(dateSet);
  return dates.length > 0
    ? new Date(Math.min(...dates.map((date) => new Date(date))))
    : null;
}

function countLikesAndDislikesByDay(data) {
  // Create an object to store counts for each day
  if (data.length === 0) {
    return null;
  }

  const dayCounts = { likes: {}, dislikes: {} };

  // Loop through the data and count likes and dislikes for each day
  data.forEach((item) => {
    const date = new Date(item.timestamp).toISOString().split("T")[0];

    if (!dayCounts.likes[date] && item.type === "like") {
      dayCounts.likes[date] = 1;
    } else if (item.type === "like") {
      dayCounts.likes[date]++;
    }

    if (!dayCounts.dislikes[date] && item.type === "dislike") {
      dayCounts.dislikes[date] = 1;
    } else if (item.type === "dislike") {
      dayCounts.dislikes[date]++;
    }
  });

  // Get the range of dates from the earliest day to today
  const startDateLikes = getMinDate(dayCounts.likes);
  const startDateDislikes = getMinDate(dayCounts.dislikes);
  const startDate =
    startDateLikes && startDateDislikes
      ? new Date(Math.min(startDateLikes, startDateDislikes))
      : startDateLikes || startDateDislikes || new Date();
  const endDate = new Date();

  // Create an array with counts for each day, filling in missing days with 0
  const result = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const likeCount = dayCounts.likes[dateStr] || 0;
    const dislikeCount = dayCounts.dislikes[dateStr] || 0;
    const count = likeCount + dislikeCount;

    result.push({ date: dateStr, likeCount, dislikeCount, count });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

module.exports = {
  getChannelDataById,
  getDashboardData,
  getAnalyticsDataChannel,
  getAnalyticsDataVideo,
};
