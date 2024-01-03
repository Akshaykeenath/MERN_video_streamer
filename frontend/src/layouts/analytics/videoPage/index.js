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
import { getAnalyticsData } from "services/userManagement";
import { CircularProgress, Icon } from "@mui/material";
import { useMaterialUIController, setNotification } from "context";
import ChannelGraphsAnalytics from "./components/ChannelGraphsAnalytics";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { decodeUrlVideoId } from "functions/general/encription";
import { getAnalyticsDataVideo } from "services/userManagement";
import MDTypography from "components/MDTypography";
import VideoDetailsArea from "./components/VideoDetailsArea";
import MDButton from "components/MDButton";

function AnalyticsVideo() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const encodedVideoID = searchParams.get("video_id");

  const navigate = useNavigate();

  const [videoId, setVideoId] = useState(null);
  const redirect = useRouteRedirect();
  const [controller, dispatch] = useMaterialUIController();
  const { fetchData, response, error } = getAnalyticsDataVideo();
  const [currentTime, setCurrentTime] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
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
    setVideoId(decodeUrlVideoId(encodedVideoID));
  }, [encodedVideoID]);

  useEffect(() => {
    if (videoId) {
      fetchData(videoId);
    }
  }, [videoId]);

  useEffect(() => {
    if (response) {
      if (response.message.chartData) {
        setGraphData(response.message.chartData);
      }
      if (response.message.videoData) {
        setVideoData(response.message.videoData);
      }
      setLoading(false);
    }
    if (error) {
      if (error.response && error.response.data && error.response.data.message) {
        const noti = {
          message: error.response.data.message,
          color: "error",
        };
        setNotification(dispatch, noti);
      } else {
        const noti = {
          message: "Error in Fetching data",
          color: "error",
        };
        setNotification(dispatch, noti);
      }
      setLoading(false);
    }
  }, [response, error]);

  const handleBackClick = () => {
    if (location.state && location.state.prevUrl) {
      navigate(location.state.prevUrl);
    } else {
      redirect("videoAnalyticsChannel");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox>
        <Grid container direction="row" columnSpacing={1}>
          <Grid item>
            <MDButton
              iconOnly
              color="info"
              size="small"
              variant="gradient"
              onClick={() => handleBackClick()}
            >
              <Icon>arrow_back_ios</Icon>
            </MDButton>
          </Grid>
          <Grid item>
            <MDTypography color="info" variant="h4">
              Video analytics
            </MDTypography>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox pt={1}>
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
        <MDBox mb={1}>{graphData && <ChannelGraphsAnalytics graphData={graphData} />}</MDBox>
        {/* End Channel Chart Datas */}

        {/* Video Details Area */}
        <MDBox>{videoData && <VideoDetailsArea videoData={videoData} />}</MDBox>
        {/* End Video Details Area */}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AnalyticsVideo;
