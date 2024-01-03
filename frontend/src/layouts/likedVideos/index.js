// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import StudioNavbar from "examples/Navbars/StudioNavbar";
import { useEffect, useState } from "react";
import { CircularProgress, Grid, Icon } from "@mui/material";
import { useMaterialUIController, setNotification } from "context";
import { getTrendingPageData } from "services/videoManagement";
import VideoList from "examples/VideoLayouts/List";
import { apiMyLikedVideos } from "services/userManagement";
import MDTypography from "components/MDTypography";

function LikedVideosPage() {
  const [controller, dispatch] = useMaterialUIController();
  const { sidenavColor } = controller;

  const { getMyLikedVideos, response, error } = apiMyLikedVideos();
  const [loading, setLoading] = useState(true);
  const [videoDataLiked, setVideoDataLiked] = useState([]);
  useEffect(() => {
    getMyLikedVideos();
  }, []);

  useEffect(() => {
    if (error) {
      const noti = {
        message: "Error in Fetching data",
        color: "error",
      };
      setNotification(dispatch, noti);
      setLoading(false);
    } else if (response) {
      if (response.likedVideos) {
        setVideoDataLiked(response.likedVideos);
      }
      setLoading(false);
    }
  }, [response, error]);

  return (
    <DashboardLayout>
      <StudioNavbar />
      {videoDataLiked.length > 0 ? (
        <VideoList
          title={{ color: sidenavColor, text: "Liked by you", variant: "h4" }}
          videoList={videoDataLiked}
        />
      ) : (
        !loading && (
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            rowSpacing={2}
            sx={{ height: "80vh" }}
          >
            <Grid item>
              <MDTypography color="text" variant="h4">
                You didn&apos;t like any videos?
              </MDTypography>
            </Grid>
            <Grid item>
              <MDTypography color="text" variant="h5" verticalAlign="bottom">
                That&apos;s sad&nbsp; <Icon>sentiment_very_dissatisfied</Icon>
              </MDTypography>
            </Grid>
          </Grid>
        )
      )}
      {loading && (
        <Grid container alignItems="center" justifyContent="center" sx={{ height: "80vh" }}>
          <Grid item>
            <CircularProgress color="secondary" />
          </Grid>
        </Grid>
      )}
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default LikedVideosPage;
