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

module.exports = { getVideoById, updateVideo };
