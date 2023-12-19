import { useEffect, useState } from "react";
import myaxios from "config/axios";

export function videoReactions() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
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

export function subscribeToChannel() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  const addSubscribe = async (channelId, subscribe) => {
    const data = {
      channelId: channelId,
      subscribe: subscribe,
    };
    await myaxios
      .post("/private/video/subscribe", data)
      .then((response) => {
        setResponse(response);
      })
      .catch((err) => {
        setError(err);
      });
  };

  return { addSubscribe, response, error };
}
