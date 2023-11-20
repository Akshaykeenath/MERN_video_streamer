import { Avatar, Grid, Skeleton } from "@mui/material";
import KEVideoPlayer from "components/KEVideoPlayer";
import MDAvatar from "components/MDAvatar";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import StudioNavbar from "examples/Navbars/StudioNavbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoDataByID } from "services/videoManagement";
import { useMaterialUIController, setNotification } from "context";

function VideoViewMaster() {
  const { videoId } = useParams();
  const [controller, dispatch] = useMaterialUIController();
  const { response, error } = getVideoDataByID(videoId);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
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
          <MDTypography color="text">Video Area</MDTypography>
          {loading && (
            <>
              <Skeleton variant="rounded" animation="wave" height="60vh" />
              <Skeleton variant="circular" height="10vh" width="10vh">
                <Avatar />
              </Skeleton>
            </>
          )}
          {videos.length > 0 && <KEVideoPlayer type="real" video={videos} />}
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
