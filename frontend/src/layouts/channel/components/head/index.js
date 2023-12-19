import { Card, Grid, Icon, Skeleton } from "@mui/material";
import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import proPic from "assets/images/propicWhite.png";
import { useEffect, useState } from "react";
import MDButton from "components/MDButton";
import { useMaterialUIController, setOtherNotification } from "context";
import { subscribeToChannel } from "services/videoManagement/likeCommentViews";
import { formatCountToKilos } from "functions/general/count";

function ChannelHeadArea({ channel }) {
  const { addSubscribe } = subscribeToChannel();
  const [controller, dispatch] = useMaterialUIController();
  const { darkMode } = controller;
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [channelPic, setChannelPic] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  useEffect(() => {
    if (channel) {
      setSubscribed(channel.isSubscribed);
      setIsOwner(channel.isOwner);
      setSubscribersCount(Number(channel.subscribers));
      setIsDataLoaded(true);
    }
  }, [channel]);
  useEffect(() => {
    if (channel) {
      if (channel.img) {
        setChannelPic(channel.img);
      } else {
        setChannelPic(proPic);
      }
    }
  }, [channel]);

  const handleSubscribe = () => {
    setSubscribersCount(Number(channel.subscribers));
    if (subscribed) {
      setSubscribed(false);
      addSubscribe(channel._id, "false");
      setOtherNotification(dispatch, "Unsubscribed");
      if (channel.isSubscribed) {
        setSubscribersCount(Number(channel.subscribers) - 1);
      }
    } else {
      setSubscribed(true);
      addSubscribe(channel._id, "true");
      setOtherNotification(dispatch, "Subscribed");
      if (!channel.isSubscribed) {
        setSubscribersCount(Number(channel.subscribers) + 1);
      }
    }
  };

  return (
    <Card>
      <MDBox px={2} my={1}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          columnSpacing={1}
        >
          <Grid item>
            {channelPic ? (
              <MDAvatar src={channelPic} size="xxl" shadow="xxl" bgColor="dark" />
            ) : (
              <Skeleton variant="circular" animation="wave">
                <MDAvatar src={proPic} size="xxl" shadow="xxl" bgColor="dark" />
              </Skeleton>
            )}
          </Grid>
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                {channel ? (
                  <MDTypography color="text" variant="h5">
                    {channel.title}
                  </MDTypography>
                ) : (
                  <MDBox>
                    <Skeleton variant="rounded" animation="wave">
                      <MDTypography color="text" variant="h5">
                        Sample channel Name
                      </MDTypography>
                    </Skeleton>
                    <MDBox mt={1}>
                      <Skeleton variant="rounded" animation="wave">
                        <MDTypography color="text" variant="button">
                          Sample channel Name
                        </MDTypography>
                      </Skeleton>
                    </MDBox>
                  </MDBox>
                )}
              </Grid>
              <Grid item mt={-1}>
                <Grid container direction="row" columnSpacing={1}>
                  <Grid item>
                    {channel && (
                      <MDTypography color="text" variant="button">
                        @{channel.uname}
                      </MDTypography>
                    )}
                  </Grid>
                  <Grid item>
                    {channel && (
                      <MDTypography color="text" variant="button">
                        ● {formatCountToKilos(subscribersCount)} subscribers
                      </MDTypography>
                    )}
                  </Grid>
                  <Grid item>
                    {channel && (
                      <MDTypography color="text" variant="button">
                        ● {channel.videos} videos
                      </MDTypography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {!isOwner && isDataLoaded && (
            <Grid item>
              {subscribed ? (
                <MDButton
                  color={darkMode ? "light" : "dark"}
                  variant={darkMode ? "gradient" : "contained"}
                  circular
                  size="small"
                  onClick={handleSubscribe}
                >
                  subscribed &nbsp;
                  <Icon baseClassName="material-icons" fontSize="small">
                    check
                  </Icon>
                </MDButton>
              ) : (
                <MDButton
                  color="info"
                  variant="contained"
                  circular
                  onClick={handleSubscribe}
                  size="small"
                >
                  Subscribe
                </MDButton>
              )}
            </Grid>
          )}
        </Grid>
      </MDBox>
    </Card>
  );
}

ChannelHeadArea.propTypes = {
  channel: PropTypes.any,
};

export default ChannelHeadArea;
