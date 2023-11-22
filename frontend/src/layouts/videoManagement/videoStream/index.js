import { Avatar, Card, Grid, Skeleton, useMediaQuery } from "@mui/material";
import KEVideoPlayer from "components/KEVideoPlayer";
import MDAvatar from "components/MDAvatar";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import StudioNavbar from "examples/Navbars/StudioNavbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useMaterialUIController,
  setMiniSidenav,
  setNotification,
  setOtherNotification,
} from "context";
import MDBox from "components/MDBox";
import ChannelLikeArea from "./components/channelLikeArea";
import DescriptionArea from "./components/descriptionArea";
import { getVideoDataByIdWatch } from "services/videoManagement";

function VideoViewMaster() {
  const { videoId } = useParams();
  const [controller, dispatch] = useMaterialUIController();
  const isXs = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const { response, error } = getVideoDataByIdWatch(videoId);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]); // Video data like array urls and poster data
  const [videoDetail, setVideoDetail] = useState([]); // Other details like channel, likes

  useEffect(() => {
    setMiniSidenav(dispatch, true);

    return () => {
      setMiniSidenav(dispatch, false);
    };
  }, []);

  useEffect(() => {
    if (response && response.video) {
      setLoading(false);
      if (response.video.privacy === "public") {
        console.log("Response :", response.video);
        const mappedVideos = response.video.video.map((videoItem) => ({
          url: videoItem.url,
          poster: response.video.poster[0].url, // Assuming there's only one poster in the response
          size: videoItem.size,
        }));
        // Set the mapped videos to the state
        setVideos(mappedVideos);
        setVideoDetail(response.video);
      } else {
        const noti = {
          message: "Video is not public",
          color: "error",
        };
        setNotification(dispatch, noti);
      }
    }
    if (error) {
      const noti = {
        message: "Video Not Found",
        color: "error",
      };
      setNotification(dispatch, noti);
      setLoading(false);
    }
  }, [response, error]);

  return (
    <DashboardLayout>
      <StudioNavbar />
      <Grid
        container
        columnSpacing={3}
        rowSpacing={1}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={9}>
          {loading && (
            <>
              <Skeleton variant="rounded" animation="wave" height={isMd ? "33vw" : "52vw"} />
              <Skeleton variant="circular" height="10vh" width="10vh">
                <Avatar />
              </Skeleton>
            </>
          )}
          {videos.length > 0 && (
            <Card>
              <MDBox px={1} py={0.5}>
                <KEVideoPlayer type="real" video={videos} />
              </MDBox>
              <MDBox px={2} pt={2}>
                <MDTypography color="dark" variant="h5">
                  {videoDetail.title}
                </MDTypography>
              </MDBox>
              <ChannelLikeArea video={videoDetail} />
              <DescriptionArea
                description={videoDetail.desc}
                views={videoDetail.views}
                date={videoDetail.timestamp}
              />
            </Card>
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          <MDTypography color="text">Side Area</MDTypography>
        </Grid>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
}

export default VideoViewMaster;
