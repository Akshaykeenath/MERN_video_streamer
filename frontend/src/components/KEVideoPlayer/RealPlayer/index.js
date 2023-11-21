import React, { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "components/KEVideoPlayer/plyr.css";
import PropTypes from "prop-types";

const KEVideoPlayerReal = ({ video, sx }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    try {
      playerRef.current = new Plyr(videoRef.current, {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "captions",
          "settings",
          "pip",
          "airplay",
          "fullscreen",
        ],
        hideControls: true,
        keyboard: { focused: true, global: true },
        ratio: "16:9",
        autoplay: true,
      });
    } catch (error) {
      console.log("Error initializing Plyr:", error);
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.log("Error destroying Plyr:", error);
        }
      }
    };
  }, []);

  return (
    <video ref={videoRef} poster={video[0].poster || null} style={sx}>
      {video.map((videos, index) => (
        <source key={index} src={videos.url} type="video/mp4" size={videos.size} />
      ))}
      Your browser does not support the video tag.
    </video>
  );
};

KEVideoPlayerReal.propTypes = {
  video: PropTypes.any,
  sx: PropTypes.any,
};

KEVideoPlayerReal.defaultProps = {
  video: {
    url: null,
    poster: null,
  },
  sx: {},
};

export default KEVideoPlayerReal;
