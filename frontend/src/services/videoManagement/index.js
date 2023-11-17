import axios from "axios";
import myaxios from "config/axios";
import { FirebaseDelete } from "functions/firebaseManagement/delete";
import { FirebaseUpload } from "functions/firebaseManagement/uploads";
import { useEffect, useState } from "react";

const url = process.env.REACT_APP_API_URL;

export async function apiUploadVideo(videoData, onProgress) {
  const token = localStorage.getItem("currentUserJWT");
  const { videoFile, poster } = videoData;
  const vidPath = "/files/videos/high/";
  const postPath = "/files/poster/high/";
  let totalProgress = 0;
  let posterResp;
  let videoResp;

  const updateProgress = (progress) => {
    totalProgress += progress;
    onProgress(totalProgress);
  };

  try {
    posterResp = await FirebaseUpload(poster, postPath);
    if (posterResp.status === "success") {
      updateProgress(33);
    } else {
      throw new Error("Failed to upload poster");
    }

    videoResp = await FirebaseUpload(videoFile, vidPath);
    if (videoResp.status === "success") {
      updateProgress(34);
    } else {
      throw new Error("Failed to upload video");
    }

    if (videoResp.status === "success" && posterResp.status === "success") {
      const videoUrlData = {
        url: videoResp.message,
        firebaseUrl: videoResp.storagePath,
      };
      const posterUrlData = {
        url: posterResp.message,
        firebaseUrl: posterResp.storagePath,
      };
      const data = {
        data: videoData.details,
        video: videoUrlData,
        poster: posterUrlData,
      };

      const response = await myaxios.post(`/private/video/upload`, data);
      if (response) {
        updateProgress(33);
      } else {
        throw new Error("Failed to save video");
      }
      return response;
    }
  } catch (error) {
    console.error("Error in apiUploadVideo", error);
    if (videoResp.storagePath) {
      FirebaseDelete(videoResp.storagePath);
    }
    if (posterResp.storagePath) {
      FirebaseDelete(posterResp.storagePath);
    }

    if (error.response && error.response.statusText === "Unauthorized") {
      return error.response.statusText;
    }
  }
}

export function getMyvideoData() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    myaxios
      .get("/private/video/my")
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  return { response, error };
}

export function getHomeData() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    myaxios
      .get(`/private/home`)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  return { response, error };
}
