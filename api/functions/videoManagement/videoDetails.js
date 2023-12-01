const VideoModel = require("../../models/videoModel");

async function getVideoById(videoId) {
  if (videoId) {
    try {
      const video = await VideoModel.findById(videoId);
      return video;
    } catch (error) {
      console.error("Error finding video by ID:", error);
      throw error; // You may want to handle this error in a different way based on your application's needs
    }
  }
}

async function getRelatedVideos(videoId) {
  try {
    // Step 2: Fetch the details of the specified video
    const originalVideo = await VideoModel.findById(videoId);

    if (!originalVideo) {
      throw new Error("Video not found");
    }

    // Step 3: Extract relevant information for finding related videos
    const tags = originalVideo.tags;
    const titleWords = originalVideo.title.split(/\s+/);
    const descriptionWords = originalVideo.desc.split(/\s+/);

    // Combine tags, title words, and description words to create a list of related words
    const relatedWords = [...tags, ...titleWords, ...descriptionWords];

    // Step 4: Query the database to find videos with similar tags, title, or description
    let relatedVideos = await VideoModel.find({
      _id: { $ne: videoId }, // Exclude the original video
      $or: [
        { tags: { $in: relatedWords } },
        { title: { $regex: new RegExp(relatedWords.join("|"), "i") } },
        { desc: { $regex: new RegExp(relatedWords.join("|"), "i") } },
      ],
    })
      .populate({
        path: "uploader",
        model: "userdata",
        select: "fname lname uname email channel",
      })
      .limit(10); // Limit the result to the most related 10 videos

    // Step 5: If no related videos are found, fetch additional default videos (e.g., most views)
    if (relatedVideos.length < 10) {
      const existingVideoIds = relatedVideos.map((video) => video._id);

      const additionalDefaultVideos = await VideoModel.find({
        _id: { $ne: videoId, $nin: existingVideoIds }, // Exclude existing video IDs
      })
        .sort({ viewsCount: -1 }) // Sort by most views
        .populate({
          path: "uploader",
          model: "userdata",
          select: "fname lname uname email channel",
        })
        .limit(10 - relatedVideos.length); // Limit to the remaining needed videos

      // Concatenate the related videos with the additional default videos
      relatedVideos = relatedVideos.concat(additionalDefaultVideos);
    }

    // Step 6: Sort the videos by the number of matching tags in descending order
    relatedVideos.sort((a, b) => {
      const countA = tags.filter((tag) => a.tags.includes(tag)).length;
      const countB = tags.filter((tag) => b.tags.includes(tag)).length;

      return countB - countA;
    });

    // Step 7: Return the set of related videos
    let newVideos = [];

    relatedVideos.forEach((vid) => {
      const newVid = {
        _id: vid._id,
        poster: vid.poster,
        timestamp: vid.timestamp,
        uploader: vid.uploader,
        video: vid.video,
        viewsCount: vid.viewsCount,
        title: vid.title,
        desc: vid.desc,
      };
      newVideos.push(newVid);
    });

    return newVideos;
  } catch (error) {
    console.error("Error retrieving related videos:", error.message);
    throw error;
  }
}

async function updateVideo(videoId, updateData) {
  try {
    // Assuming `updateData` is an object containing the fields you want to update
    const updatedVideo = await VideoModel.findByIdAndUpdate(
      videoId,
      { $set: updateData },
      { new: true } // This option ensures that the updated document is returned
    );

    return updatedVideo;
  } catch (error) {
    // Handle errors appropriately
    console.error("Error updating video:", error);
    throw error;
  }
}

module.exports = { getVideoById, updateVideo, getRelatedVideos };
