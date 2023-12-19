// videoService.js
const videoModel = require("../../models/videoModel");
const userModel = require("../../models/userModel");

async function addLikeToVideo(videoId, userId, likeType) {
  try {
    if (!["like", "dislike", "nolike"].includes(likeType)) {
      throw new Error(
        "Invalid likeType. It should be either 'like', 'dislike', or 'nolike'."
      );
    }
    const video = await videoModel.findById(videoId);

    if (!video) {
      throw new Error("Video not found");
    }

    if (likeType === "nolike") {
      // Remove existing like or dislike
      const existingLikeIndex = video.likes.findIndex(
        (like) => like.user.toString() === userId.toString()
      );

      if (existingLikeIndex !== -1) {
        video.likes.splice(existingLikeIndex, 1);
      }
    } else {
      // Check if the user has already liked or disliked the video
      const existingLike = video.likes.find(
        (like) => like.user.toString() === userId.toString()
      );

      if (existingLike) {
        // User has already liked or disliked, update the type
        existingLike.type = likeType;
      } else {
        // User has not liked or disliked before, add a new like
        video.likes.push({
          user: userId,
          type: likeType,
          timestamp: Date.now(),
        });
      }
    }

    await video.save(); // Save the updated video document

    return { message: "Like added successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
}

async function addViewToVideo(videoId, userId) {
  try {
    const video = await videoModel.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }
    video.views.push({
      user: userId,
      timestamp: Date.now(),
    });
    await video.save();
    return { message: "View added successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
}

async function subscribeToChannel(channelOwnerId, subscriberId) {
  try {
    const channelOwner = await userModel.findById(channelOwnerId);
    if (!channelOwner) {
      throw new Error("Channel owner not found");
    }

    // Check if the subscriber is already subscribed
    const isSubscribed = channelOwner.channel.subscribers.some(
      (subscriber) => String(subscriber.user) === String(subscriberId)
    );

    if (isSubscribed) {
      return { message: "Already subscribed to this channel" };
    }

    // If not subscribed, add the subscriber
    channelOwner.channel.subscribers.push({
      user: subscriberId,
      timestamp: Date.now(),
    });

    await channelOwner.save();
    return { message: "Subscribed to the channel successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
}

async function unsubscribeFromChannel(channelOwnerId, subscriberId) {
  try {
    const channelOwner = await userModel.findById(channelOwnerId);
    if (!channelOwner) {
      throw new Error("Channel owner not found");
    }

    // Find the index of the subscriber with the given user ID
    const subscriberIndex = channelOwner.channel.subscribers.findIndex(
      (subscriber) => String(subscriber.user) === String(subscriberId)
    );

    // Check if the user is not subscribed
    if (subscriberIndex === -1) {
      return { message: "Not subscribed to this channel" };
    }

    // If subscribed, remove the subscriber from the array
    channelOwner.channel.subscribers.splice(subscriberIndex, 1);

    await channelOwner.save();
    return { message: "Unsubscribed from the channel successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  addLikeToVideo,
  addViewToVideo,
  subscribeToChannel,
  unsubscribeFromChannel,
};
