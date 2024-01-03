// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import StudioNavbar from "examples/Navbars/StudioNavbar";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getChannelDataByIdWatch } from "services/userManagement";
import {
  useMaterialUIController,
  setMiniSidenav,
  setNotification,
  setOtherNotification,
} from "context";
import ChannelHeadArea from "./components/head";
import { Card } from "@mui/material";
import ChannelBodyArea from "./components/videoArea";

function Channel() {
  const [controller, dispatch] = useMaterialUIController();
  const { channelId } = useParams();
  const { fetchVideoData, response, error } = getChannelDataByIdWatch();

  //   states
  const [channelData, setChannelData] = useState(null);
  const [videoData, setVideoData] = useState(null);
  useEffect(() => {
    fetchVideoData(channelId);
  }, [channelId]);

  useEffect(() => {
    if (response) {
      if (response.message && response.message.channel) {
        setChannelData(response.message.channel);
      }
      if (response.message && response.message.videos) {
        setVideoData(response.message.videos);
      }
    }
    if (error) {
      if (error.response && error.response.data) {
        const noti = {
          message: error.response.data.message ? error.response.data.message : "An Error occured",
          color: "error",
        };
        setNotification(dispatch, noti);
      } else {
        console.log(error);
        const noti = {
          message: "An Error occured",
          color: "error",
        };
        setNotification(dispatch, noti);
      }
    }
  }, [response, error]);

  return (
    <DashboardLayout>
      <StudioNavbar />
      <ChannelHeadArea channel={channelData} />
      <ChannelBodyArea videos={videoData} />
      <Footer />
    </DashboardLayout>
  );
}

export default Channel;
