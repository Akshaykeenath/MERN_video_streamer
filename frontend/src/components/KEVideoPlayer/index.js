import React from "react";
import PropTypes from "prop-types";
import KEVideoPlayerHover from "./HoverPlayer";

const KEVideoPlayer = ({ type, video }) => {
  const renderVideoPlayer = () => {
    if (type === "hover") {
      return <KEVideoPlayerHover video={video} />;
    }
  };

  return <div>{renderVideoPlayer()}</div>;
};

KEVideoPlayer.defaultProps = {
  type: "hover",
};

KEVideoPlayer.propTypes = {
  type: PropTypes.string,
  video: PropTypes.object,
};

export default KEVideoPlayer;
