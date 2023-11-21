import React, { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "components/KEVideoPlayer/plyr.css";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";

const KEVideoPlayerHover = ({ video, sx }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    try {
      playerRef.current = new Plyr(videoRef.current, {
        controls: ["current-time", "duration"],
        muted: true,
        hideControls: false,
        keyboard: { focused: false, global: false },
        tooltips: { controls: false, seek: false },
      });
      // Set initial control color
      if (playerRef.current.elements.controls) {
        playerRef.current.elements.controls.style.display = "none";
      }
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

  const handleMouseEnter = () => {
    if (playerRef.current && playerRef.current.paused) {
      try {
        playerRef.current.decreaseVolume(1);
        playerRef.current.play();
      } catch (error) {
        console.log("Error playing video:", error);
      }
    }
    setIsHover(true);
    // Set the control color to white (#fff)
    if (playerRef.current.elements.controls) {
      playerRef.current.elements.controls.style.display = "flex";
    }
  };

  const handleMouseLeave = () => {
    if (playerRef.current && playerRef.current.playing) {
      try {
        playerRef.current.pause();
      } catch (error) {
        console.log("Error pausing video:", error);
      }
    }
    setIsHover(false);
    // Set the control color to transparent
    if (playerRef.current.elements.controls) {
      playerRef.current.elements.controls.style.display = "none";
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        borderRadius: "16px",
        maxWidth: "340px",
      }}
    >
      <MDBox
        component="img"
        src={video.poster}
        alt="Poster"
        borderRadius="lg"
        shadow="md"
        width="100%"
        height="100%"
        maxWidth="340px"
        position="relative"
        zIndex={1}
        display={isHover ? "none" : "flex"}
      />
      <video
        ref={videoRef}
        poster={video.poster}
        style={{ display: isHover ? "flex" : "none", ...sx }}
      >
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

KEVideoPlayerHover.defaultProps = {
  sx: {},
};

KEVideoPlayerHover.propTypes = {
  video: PropTypes.shape({
    url: PropTypes.string,
    poster: PropTypes.string,
  }),
  sx: PropTypes.object,
};

export default KEVideoPlayerHover;
