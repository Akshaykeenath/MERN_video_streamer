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
import { getAnalyticsData } from "services/userManagement";
import { CircularProgress } from "@mui/material";
import { useMaterialUIController, setNotification } from "context";
import ChannelGraphsAnalytics from "./components/ChannelGraphsAnalytics";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";

function AnalyticsChannel() {
  const redirect = useRouteRedirect();
  const [controller, dispatch] = useMaterialUIController();
  const { fetchData, response, error } = getAnalyticsData();
  const [currentTime, setCurrentTime] = useState(null);
  const [videoList, setVideoList] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

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
      if (response.message.videoList) {
        setVideoList(response.message.videoList);
      }
      if (response.message.chartData) {
        setGraphData(response.message.chartData);
      }
      setLoading(false);
    }
    if (error) {
      const noti = {
        message: "Error in Fetching data",
        color: "error",
      };
      setNotification(dispatch, noti);
      setLoading(false);
    }
  }, [response, error]);

  useEffect(() => {
    if (graphData) {
      if (!graphData.likes && !graphData.views && !graphData.subscribers) {
        setNoData(true);
      }
    }
  }, [graphData]);

  const alertContent = () => (
    <MDTypography variant="body2" color="white">
      You dont have enough data to display{" "}
      <MDTypography component="a" variant="body2" fontWeight="medium" color="white">
        Channel Analytics
      </MDTypography>
    </MDTypography>
  );
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pl={1}>
        <MDTypography color="info" variant="h4">
          Channel analytics
        </MDTypography>
      </MDBox>
      {noData && (
        <MDAlert color="error" dismissible>
          {alertContent()}
        </MDAlert>
      )}
      <MDBox py={1}>
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

export default AnalyticsChannel;
