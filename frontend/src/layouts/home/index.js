// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import StudioNavbar from "examples/Navbars/StudioNavbar";
import Footer from "examples/Footer";
import { useEffect, useState } from "react";
import { useRouteRedirect } from "services/redirection";
import MDTypography from "components/MDTypography";
import VideoGridLayout from "examples/VideoLayouts/Grid";
import { getHomeData } from "services/videoManagement";
import { CircularProgress, Grid } from "@mui/material";
import { useMaterialUIController, setNotification } from "context";
import { getRelativeTime } from "functions/general/time";
import { formatCountToKilos } from "functions/general/count";
import proPic from "assets/images/propicWhite.png";

function Home() {
  const redirect = useRouteRedirect();
  const [controller, dispatch] = useMaterialUIController();
  const { sidenavColor } = controller;

  const { response, error } = getHomeData();
  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState([]);
  useEffect(() => {
    if (error) {
      const noti = {
        message: "Error in Fetching data",
        color: "error",
      };
      setNotification(dispatch, noti);
      setLoading(false);
    } else if (response != null) {
      const trendingVideos = response.trending;
      const mappedVideoData = trendingVideos.map((currVideo, index) => {
        const {
          _id,
          title,
          uploader,
          video: videoArray,
          poster,
          timestamp,
          viewsCount,
        } = currVideo;
        const { channel, _id: channelUrl } = uploader;
        const channelPic =
          channel.img && channel.img[0] && channel.img[0].url ? channel.img[0].url : proPic;
        const videoUrl = videoArray[0].url;
        const posterUrl = poster[0].url;

        return {
          video: {
            url: videoUrl,
            poster: posterUrl,
          },
          title: title,
          channel: {
            name: uploader.fname + " " + uploader.lname,
            image: channelPic,
            route: `/channel/${channelUrl}`, // Replace with actual channel route if available
          },
          views: formatCountToKilos(viewsCount) + " " + "views", // You may replace this with actual view count
          time: getRelativeTime(timestamp), // You may replace this with actual upload time
          action: {
            type: "internal", // Change to "external" if needed
            route: `/video/${_id}`, // Replace with actual video route if available
          },
        };
      });

      setVideoData(mappedVideoData);
      setLoading(false);
    }
  }, [response, error]);

  return (
    <DashboardLayout>
      <StudioNavbar />
      {response ? (
        <VideoGridLayout
          title={{ color: sidenavColor, text: "trending videos", variant: "h4" }}
          videos={videoData}
        />
      ) : (
        loading && (
          <Grid container alignItems="center" justifyContent="center" sx={{ height: "80vh" }}>
            <Grid item>
              <CircularProgress color="secondary" />
            </Grid>
          </Grid>
        )
      )}
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Home;
