// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import StudioNavbar from "examples/Navbars/StudioNavbar";
import { useEffect, useState } from "react";
import { CircularProgress, Grid } from "@mui/material";
import { useMaterialUIController, setNotification } from "context";
import { getTrendingPageData } from "services/videoManagement";
import VideoList from "examples/VideoLayouts/List";

function Trending() {
  const [controller, dispatch] = useMaterialUIController();
  const { sidenavColor } = controller;

  const { fetchData, response, error } = getTrendingPageData();
  const [loading, setLoading] = useState(true);
  const [videoDataRecent, setVideoDataRecent] = useState([]);
  const [videoDataAlltime, setVideoDataAlltime] = useState([]);
  useEffect(() => {
    fetchData();
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
      if (response.trendingRecent) {
        setVideoDataRecent(response.trendingRecent);
      }
      if (response.trendingAlltime) {
        setVideoDataAlltime(response.trendingAlltime);
      }
      setLoading(false);
    }
  }, [response, error]);

  return (
    <DashboardLayout>
      <StudioNavbar />
      {videoDataRecent.length > 0 && (
        <VideoList
          title={{ color: sidenavColor, text: "Trending this month", variant: "h5" }}
          videoList={videoDataRecent}
        />
      )}
      {videoDataAlltime.length > 0 && (
        <Grid container mt={2}>
          <Grid item xs={12} md={10}>
            <VideoList
              title={{ color: sidenavColor, text: "All time favorites", variant: "h5" }}
              videoList={videoDataAlltime}
            />
          </Grid>
        </Grid>
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

export default Trending;
