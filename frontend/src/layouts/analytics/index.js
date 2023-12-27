/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Dashboard components
import { useEffect, useMemo, useState } from "react";
import { useRouteRedirect } from "services/redirection";
import VideoListAnalytics from "./components/VideoListAnalytics";
import ChannelGraphsAnalytics from "./components/ChannelGraphsAnalytics";
import { getAnalyticsData } from "services/userManagement";
import { CircularProgress } from "@mui/material";
import { useMaterialUIController, setNotification } from "context";

function Analytics() {
  const redirect = useRouteRedirect();
  const [controller, dispatch] = useMaterialUIController();
  const { fetchData, response, error } = getAnalyticsData();
  const [currentTime, setCurrentTime] = useState(null);
  const [videoList, setVideoList] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const currentTimestampString = new Date().toISOString();
    setCurrentTime(currentTimestampString);
    // Set the title when the component mounts
    document.title = "KeTube Studio";

    // Optionally, you can return a cleanup function to reset the title when the component unmounts
    return () => {
      document.title = "KeTube";
    };
  }, []);

  useEffect(() => {
    if (response) {
      console.log(response);
      if (response.message.videoList) {
        setVideoList(response.message.videoList);
      }
      if (response.message.chartData) {
        setGraphData(response.message.chartData);
      }
      setLoading(false);
    }
    if (error) {
      console.log(error);
      const noti = {
        message: "Error in Fetching data",
        color: "error",
      };
      setNotification(dispatch, noti);
      setLoading(false);
    }
  }, [response, error]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {loading && (
          <MDBox>
            <Grid container alignItems="center" justifyContent="center" sx={{ height: "80vh" }}>
              <Grid item>
                <CircularProgress color="inherit" />
              </Grid>
            </Grid>
          </MDBox>
        )}
        {/* Channel Chart Datas */}
        <MDBox mb={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              {graphData && <ChannelGraphsAnalytics graphData={graphData} />}
            </Grid>
          </Grid>
        </MDBox>
        {/* End Channel Chart Datas */}

        {/* Video List Analytics */}
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              {videoList && videoList.length > 0 && <VideoListAnalytics videoList={videoList} />}
            </Grid>
          </Grid>
        </MDBox>
        {/* End Video List Analytics */}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Analytics;
