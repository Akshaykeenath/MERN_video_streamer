import { Card, Grid, Skeleton } from "@mui/material";
import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import proPic from "assets/images/propicWhite.png";
import { useEffect, useState } from "react";

function ChannelHeadArea({ channel }) {
  const [channelPic, setChannelPic] = useState(null);
  useEffect(() => {
    if (channel) {
      if (channel.img) {
        setChannelPic(channel.img);
      } else {
        setChannelPic(proPic);
      }
    }
  });
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
                        ● 500 subscribers
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
        </Grid>
      </MDBox>
    </Card>
  );
}

ChannelHeadArea.propTypes = {
  channel: PropTypes.any,
};

export default ChannelHeadArea;
