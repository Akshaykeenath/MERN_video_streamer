import React from "react";
import PropTypes from "prop-types";
import KEVideoPlayerHover from "./HoverPlayer";
import KEVideoPlayerReal from "./RealPlayer";
import KEVideoPlayerMini from "./MiniPlayer";

const KEVideoPlayer = ({ type, video, sx }) => {
  const renderVideoPlayer = () => {
    if (type === "hover") {
      return <KEVideoPlayerHover video={video} sx={sx} />;
    } else if (type === "mini") {
      return <KEVideoPlayerMini video={video} sx={sx} />;
    } else {
      return <KEVideoPlayerReal video={video} sx={sx} />;
    }
  };

  return <div>{renderVideoPlayer()}</div>;
};

KEVideoPlayer.defaultProps = {
  type: "hover",
};

KEVideoPlayer.propTypes = {
  type: PropTypes.string,
  video: PropTypes.any,
  sx: PropTypes.any,
};

export default KEVideoPlayer;
