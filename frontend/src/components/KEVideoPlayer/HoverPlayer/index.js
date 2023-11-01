import React, { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "components/KEVideoPlayer/plyr.css";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";

const KEVideoPlayerHover = ({ video }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    playerRef.current = new Plyr(videoRef.current, {
      controls: ["current-time", "progress", "duration"],
      muted: true,
      hideControls: false,
    });
    // Set initial control color
    if (playerRef.current.elements.controls) {
      playerRef.current.elements.controls.style.display = "none";
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (playerRef.current.paused) {
      playerRef.current.play();
    }
    setIsHover(true);
    // Set the control color to white (#fff)
    if (playerRef.current.elements.controls) {
      playerRef.current.elements.controls.style.display = "flex";
    }
  };

  const handleMouseLeave = () => {
    if (playerRef.current.playing) {
      playerRef.current.pause();
    }
    setIsHover(false);
    console.log("poster ", playerRef.current.poster);
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
      <video ref={videoRef} poster={video.poster} style={{ display: isHover ? "flex" : "none" }}>
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

KEVideoPlayerHover.propTypes = {
  video: PropTypes.shape({
    url: PropTypes.string,
    poster: PropTypes.string,
  }),
};

export default KEVideoPlayerHover;
