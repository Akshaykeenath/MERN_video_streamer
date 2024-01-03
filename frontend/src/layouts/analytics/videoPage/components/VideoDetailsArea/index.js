import { Card, Grid, Icon, Tooltip, useMediaQuery } from "@mui/material";
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function VideoDetailsArea({ videoData }) {
  const navigate = useNavigate();
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [hover, setHover] = useState(false);
  const [height, setHeight] = useState(1);
  const cardRef = useRef(null);

  useLayoutEffect(() => {
    const logCardWidth = () => {
      if (cardRef.current) {
        const cardWidth = cardRef.current.clientWidth;
        setHeight((9 / 16) * cardWidth);
      }
    };
    logCardWidth();
  }, []);

  const containerStyle = {
    position: "relative",
    width: "100%", // Set the width of the container as needed
    height: `${height}px`,
    aspectRatio: "16 / 9", // 16:9 aspect ratio
    borderRadius: "16px",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "16px",
    ":hover": {
      opacity: 0.5,
    },
  };

  const poster = videoData.poster && videoData.poster[0].url;

  const handleViewVideoClick = () => {
    if (videoData._id) {
      navigate(`/video/${videoData._id}`);
    }
  };

  const overlayTextStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: hover ? 1 : 0,
    transition: "opacity 0.3s",
    pointerEvents: "none",
  };

  const ClickToWatchVideoItem = () => {
    return (
      <Grid
        container
        sx={{ ...overlayTextStyle }}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <MDBox color="white">
            <Icon baseClassName="material-icons" fontSize="large">
              smart_display
            </Icon>
          </MDBox>
        </Grid>
        <Grid item mt={-2}>
          <MDBadge
            badgeContent="Click to watch the video"
            color="light"
            variant="gradient"
            size="xs"
            container
            circular
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <MDBox>
      {videoData && (
        <Card>
          <Grid container direction="row" columnSpacing={2} height="100%">
            <Grid item xs={6} md={4} sx={{ cursor: "pointer" }}>
              <MDBox p={1}>
                <MDBox
                  style={containerStyle}
                  ref={cardRef}
                  bgColor="dark"
                  variant="gradient"
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  <MDBox
                    component="img"
                    src={poster}
                    alt="Poster"
                    borderRadius="lg"
                    shadow="md"
                    width="100%"
                    height="100%"
                    position="relative"
                    sx={imageStyle}
                    mb={-2}
                    onClick={() => handleViewVideoClick()}
                  />
                  <ClickToWatchVideoItem />
                </MDBox>
              </MDBox>
            </Grid>
            {/* Details area */}
            <Grid item xs={6} md={8} height={isMd ? `${height}px` : "100%"}>
              <Grid container direction="column" justifyContent="space-between" height="100%">
                <Grid item>
                  <Grid container direction="column">
                    <Grid item>
                      <MDBox>
                        <Tooltip title={videoData.title} placement="top">
                          <MDTypography display="inline" variant="h5" fontWeight="bold">
                            {videoData.title.slice(0, 47) +
                              (videoData.title.length >= 50 ? "..." : "")}
                          </MDTypography>
                        </Tooltip>
                      </MDBox>
                    </Grid>
                    <Grid item>
                      <MDTypography
                        display="inline"
                        color="text"
                        variant="button"
                        fontWeight="bold"
                      >
                        Total Views : {videoData.viewsCount}
                      </MDTypography>
                    </Grid>
                    <Grid item>
                      <MDTypography
                        display="inline"
                        color="text"
                        variant="button"
                        fontWeight="bold"
                      >
                        Total Likes : {videoData.likesCount}
                      </MDTypography>
                    </Grid>
                    <Grid item>
                      <MDTypography
                        display="inline"
                        color="text"
                        variant="button"
                        fontWeight="bold"
                      >
                        Total Dislikes : {videoData.dislikesCount}
                      </MDTypography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item pb={1}>
                  <MDButton
                    variant="outlined"
                    color="info"
                    circular
                    onClick={() => handleViewVideoClick()}
                  >
                    Watch Video
                  </MDButton>
                </Grid>
              </Grid>
            </Grid>
            {/* End Details area */}
          </Grid>
        </Card>
      )}
    </MDBox>
  );
}

VideoDetailsArea.propTypes = {
  videoData: PropTypes.any,
};

export default VideoDetailsArea;
