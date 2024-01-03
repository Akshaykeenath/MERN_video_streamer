// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import StudioNavbar from "examples/Navbars/StudioNavbar";
import { useEffect, useState } from "react";
import { CircularProgress, Grid, Icon } from "@mui/material";
import { useMaterialUIController, setNotification } from "context";
import VideoList from "examples/VideoLayouts/List";
import MDTypography from "components/MDTypography";
import { apiGetAllVideosData } from "services/userManagement";

function AllVideosPage() {
  const [controller, dispatch] = useMaterialUIController();
  const { sidenavColor } = controller;

  const { getAllVideosData, response, error } = apiGetAllVideosData();
  const [loading, setLoading] = useState(true);
  const [videoDataAll, setVideoDataAll] = useState([]);
  useEffect(() => {
    getAllVideosData();
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
      if (response.allVideos) {
        setVideoDataAll(response.allVideos);
      }
      setLoading(false);
    }
  }, [response, error]);

  return (
    <DashboardLayout>
      <StudioNavbar />
      {videoDataAll.length > 0 ? (
        <VideoList
          title={{ color: sidenavColor, text: "All Videos", variant: "h4" }}
          videoList={videoDataAll}
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
                No videos to show
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

export default AllVideosPage;
