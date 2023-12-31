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

export function getMyvideoData(refreshData) {
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
  }, [refreshData]);

  return { response, error };
}

export function getVideoDataByIdWatch(id) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const fetchVideoData = (id) => {
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    if (!isValidObjectId) {
      setError({ message: "Video Not Found" });
      return;
    }
    myaxios
      .get(`/private/video/watch/id/${id}`)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  };

  return { fetchVideoData, response, error };
}

export function getVideoDataByID(id) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Validate the format of the MongoDB ObjectID
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    if (!isValidObjectId) {
      setError({ message: "Video Not Found" });
      return;
    }
    myaxios
      .get(`/private/video/id/${id}`)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  }, [id]);

  return { response, error };
}

export function useDeleteVideo() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const deleteVideo = async (id) => {
    try {
      if (id) {
        // Send a DELETE request to delete the video
        await myaxios.get(`/private/video/id/${id}`).then((res) => {
          if (
            res &&
            res.data &&
            res.data.video &&
            res.data.video.poster[0] &&
            res.data.video.poster[0].firebaseUrl
          ) {
            FirebaseDelete(res.data.video.poster[0].firebaseUrl);
          }
          if (
            res &&
            res.data &&
            res.data.video &&
            res.data.video.video[0] &&
            res.data.video.video[0].firebaseUrl
          ) {
            FirebaseDelete(res.data.video.video[0].firebaseUrl);
          }
        });
        await myaxios.delete(`/private/video/id/${id}`);
        setResponse({ status: "success" });
      }
    } catch (err) {
      setError(err);
    }
  };

  return { deleteVideo, response, error };
}

export async function apiUpdateVideo(data) {
  const video = {
    video: data,
  };

  try {
    const response = await myaxios.post("/private/video/update", video);
    return { status: "success", data: response.data };
  } catch (error) {
    return { status: "error", message: error.message };
  }
}

export function getRelatedVideos() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const fetchData = (videoId) => {
    myaxios
      .get(`/private/video/related/id/${videoId}`)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  };

  return { fetchData, response, error };
}

export function getHomeData() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    myaxios
      .get(`/private/myhome`)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  return { response, error };
}

export function getTrendingPageData() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = () => {
    myaxios
      .get(`/private/mytrending`)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  };

  return { fetchData, response, error };
}

export function getSubscriptionData() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await myaxios.get("/private/mysubscriptions");
      setResponse(res.data);
    } catch (err) {
      setError(err);
    }
  };

  return { fetchData, response, error };
}

export function getSearchVideoResults() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = (searchQuery) => {
    const data = { searchQuery: searchQuery };
    myaxios
      .post(`/private/video/search/results`, data)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  };

  return { fetchData, response, error };
}
