import { Grid, Icon, Tooltip } from "@mui/material";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { useState } from "react";
import PropTypes from "prop-types";

function ChannelLikeArea({ video }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const channelName = video.uploader.fname + " " + video.uploader.lname;

  const handleLike = () => {
    setLike(!like);
    setDislike(false);
  };

  const handleDislike = () => {
    setDislike(!dislike);
    setLike(false);
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
            <MDAvatar src="https://picsum.photos/200" alt="Avatar" size="md" />
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
                <Icon>thumb_up</Icon>&nbsp; 1K
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
                <Icon>thumb_down</Icon>&nbsp; 2K
              </MDButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Share">
              <MDButton variant="gradient" circular color={darkMode ? "dark" : "light"}>
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
