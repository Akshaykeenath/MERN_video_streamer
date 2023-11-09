import axios from "axios";
import { FirebaseUpload } from "functions/firebaseManagement/uploads";

const url = process.env.REACT_APP_API_URL;

export async function apiUploadVideo(videoData, onProgress) {
  const token = localStorage.getItem("currentUserJWT");
  const { videoFile, poster } = videoData;
  const vidPath = "/files/videos/high/";
  const postPath = "/files/poster/high/";
  let totalProgress = 0;

  const updateProgress = (progress) => {
    totalProgress += progress;
    onProgress(totalProgress);
  };

  try {
    const posterResp = await FirebaseUpload(poster, postPath);
    updateProgress(33);

    const videoResp = await FirebaseUpload(videoFile, vidPath);
    updateProgress(34);

    if (videoResp.status === "success" && posterResp.status === "success") {
      const { message: videoUrl } = videoResp;
      const { message: posterUrl } = posterResp;
      const data = {
        data: videoData.details,
        video: videoUrl,
        poster: posterUrl,
      };

      const response = await axios.post(`${url}/private/video/upload`, data, {
        headers: {
          Authorization: token,
        },
      });
      if (response) {
        updateProgress(33);
      }
      return response;
    }
  } catch (error) {
    console.error("Error in apiUploadVideo", error);

    if (error.response && error.response.statusText === "Unauthorized") {
      return error.response.statusText;
    }
  }
}
