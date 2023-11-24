import { Grid, Icon, Tooltip } from "@mui/material";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useMaterialUIController, setOtherNotification } from "context";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { videoReactions } from "services/videoManagement/likeCommentViews";
import { formatCountToKilos } from "functions/general/count";
import proPic from "assets/images/propicWhite.png";

function ChannelLikeArea({ video }) {
  const [controller, dispatch] = useMaterialUIController();
  const { darkMode } = controller;
  const [like, setLike] = useState(video.likeType === "like");
  const [dislike, setDislike] = useState(video.likeType === "dislike");
  const [componentLoaded, setComponentLoaded] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const channelName = video.uploader.fname + " " + video.uploader.lname;
  const channelPic =
    video.uploader &&
    video.uploader.channel &&
    video.uploader.channel.img &&
    video.uploader.channel.img[0] &&
    video.uploader.channel.img[0].url
      ? video.uploader.channel.img[0].url
      : proPic;
  const { addLikeToVideo, response, error } = videoReactions();

  useEffect(() => {
    // This useEffect will only run after the component has loaded
    if (componentLoaded) {
      if (dislike) {
        setOtherNotification(dispatch, "Disliked");
        addLikeToVideo(video._id, "dislike");
      }
      if (like) {
        setOtherNotification(dispatch, "Liked");
        addLikeToVideo(video._id, "like");
      }
      if (!like && !dislike) {
        addLikeToVideo(video._id, "nolike");
      }
    }
  }, [like, dislike]);

  useEffect(() => {
    setLikesCount(video.likes);
    setDislikesCount(video.dislikes);
    setComponentLoaded(true);
  }, []);

  const handleLike = () => {
    if (like) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
      if (dislike) {
        setDislikesCount(dislikesCount - 1);
      }
    }
    setLike(!like);
    setDislike(false);
  };

  const handleDislike = () => {
    if (dislike) {
      setDislikesCount(dislikesCount - 1);
    } else {
      setDislikesCount(dislikesCount + 1);
      if (like) {
        setLikesCount(likesCount - 1);
      }
    }
    setDislike(!dislike);
    setLike(false);
  };

  const handleShare = () => {
    // Get the current URL and copy it to the clipboard
    const currentURL = window.location.href;

    // Use the Clipboard API to copy the URL
    navigator.clipboard.writeText(currentURL);
    setOtherNotification(dispatch, "Coppied to clipboard");
  };

  return (
    <Grid container width="100%" direction="row" justifyContent="space-between" alignItems="center">
      {/* Channel Area  */}
      <Grid item>
        <Grid
          container
          width="100%"
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          columnGap={2}
          p={1}
        >
          <Grid item>
            <Link to="#">
              <MDAvatar src={channelPic} bgColor="dark" alt="Avatar" size="md" />
            </Link>
          </Grid>
          <Grid item>
            <Grid container direction="column" justifyContent="center" rowGap={0}>
              <Grid item>
                <MDTypography color="text" variant="body2" fontWeight="bold">
                  {channelName}
                </MDTypography>
              </Grid>
              <Grid item mt={-1}>
                <MDTypography color="text" variant="button">
                  100k Subscribers
                </MDTypography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* End Channel Area  */}

      {/* Actions Area  */}
      <Grid item>
        <Grid
          container
          width="100%"
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          columnGap={1}
          px={1}
        >
          <Grid item>
            <Tooltip title="I like this">
              <MDButton
                variant="gradient"
                circular
                color={like ? "info" : darkMode ? "dark" : "light"}
                onClick={handleLike}
              >
                <Icon>thumb_up</Icon>&nbsp; {formatCountToKilos(likesCount)}
              </MDButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="I dislike this">
              <MDButton
                variant="gradient"
                circular
                color={dislike ? "info" : darkMode ? "dark" : "light"}
                onClick={handleDislike}
              >
                <Icon>thumb_down</Icon>&nbsp; {formatCountToKilos(dislikesCount)}
              </MDButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Share">
              <MDButton
                variant="gradient"
                circular
                color={darkMode ? "dark" : "light"}
                onClick={handleShare}
              >
                <Icon>share</Icon>
              </MDButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      {/* End Actions Area  */}
    </Grid>
  );
}
ChannelLikeArea.propTypes = {
  video: PropTypes.object,
};
export default ChannelLikeArea;
