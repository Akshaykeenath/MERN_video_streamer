import axios from "axios";
import { FirebaseUpload } from "functions/firebaseManagement/uploads";
import { useEffect, useState } from "react";

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
    if (posterResp.status === "success") {
      updateProgress(33);
    } else {
      throw new Error("Failed to upload poster");
    }

    const videoResp = await FirebaseUpload(videoFile, vidPath);
    if (videoResp.status === "success") {
      updateProgress(34);
    } else {
      throw new Error("Failed to upload video");
    }

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
      } else {
        throw new Error("Failed to save video");
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

export function getHomeData() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${url}/home`)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  return { response, error };
}
