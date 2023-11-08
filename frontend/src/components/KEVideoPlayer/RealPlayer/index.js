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
        controls: ["play-large", "play", "progress", "current-time", "mute", "volume"],
        hideControls: false,
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
    <video ref={videoRef} poster={video.poster || null} style={sx}>
      <source src={video.url || null} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

KEVideoPlayerReal.propTypes = {
  video: PropTypes.shape({
    url: PropTypes.string,
    poster: PropTypes.string,
  }),
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
