import { useEffect, useState } from "react";
import myaxios from "config/axios";

export function videoReactions() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (response) {
      console.log(response);
    }
    if (error) {
      console.log(error);
    }
  }, [error, response]);

  const addLikeToVideo = async (videoId, likeType) => {
    const data = {
      videoId: videoId,
      likeType: likeType,
    };
    await myaxios
      .post("/private/video/like", data)
      .then((response) => {
        setResponse(response);
      })
      .catch((err) => {
        setError(err);
      });
  };

  return { addLikeToVideo, response, error };
}
