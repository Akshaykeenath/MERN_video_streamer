// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { getMyvideoData } from "services/videoManagement";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { getRelativeDate } from "functions/general/time";
import MDButton from "components/MDButton";
import { Grid, Icon, Tooltip } from "@mui/material";
import { useMaterialUIController, setNotification } from "context";
import { encodeUrlVideoId } from "functions/general/encription";

const getCurrentUrl = () => {
  const location = useLocation();
  return location.pathname + location.search + location.hash;
};

export default function data({ refreshData, onVideoDataCallback }) {
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();

  const { response, error } = getMyvideoData(refreshData);

  const handleEditClick = (id) => {
    const data = {
      action: "edit",
      id: id,
    };
    onVideoDataCallback(data);
  };

  const handleDeleteClick = (id) => {
    const data = {
      action: "delete",
      id: id,
    };
    onVideoDataCallback(data);
  };

  const handleViewClick = (id) => {
    navigate(`/video/${id}`);
  };

  const prevUrl = getCurrentUrl();

  const handleAnalyticsClick = (id) => {
    const encodedVideoID = encodeUrlVideoId(id);
    navigate(`/studio/analytics/video?video_id=${encodedVideoID}`, {
      state: { prevUrl: prevUrl },
    });
  };

  useEffect(() => {
    if (error) {
      const noti = {
        message: "Error in Fetching data",
        color: "error",
      };
      setNotification(dispatch, noti);
      console.log("error ", error);
      const data = {
        action: "loading",
        value: false,
      };
      onVideoDataCallback(data);
    }
    if (response) {
      const data = {
        action: "loading",
        value: false,
      };
      onVideoDataCallback(data);
    }
  }, [error, response]);
  const Video = ({ image, name, onClick }) => (
    <MDBox
      display="flex"
      alignItems="center"
      lineHeight={1}
      style={{ cursor: "pointer" }} // Add this line for the pointer cursor
      onClick={() => onClick()}
    >
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name.slice(0, 47) + (name.length >= 50 ? "..." : "")}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
  Video.propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
    onClick: PropTypes.func,
  };

  return {
    columns: response
      ? [
          { Header: "video", accessor: "video", width: "45%", align: "left" },
          { Header: "status", accessor: "status", align: "center" },
          { Header: "uploaded", accessor: "uploaded", align: "center" },
          { Header: "action", accessor: "action", align: "center" },
        ]
      : [],

    rows: response
      ? response.videos.map((video) => ({
          video: (
            <Video
              image={video.poster[0].url}
              name={video.title}
              onClick={() => handleEditClick(video._id)}
            />
          ),
          status: (
            <MDBox ml={-1}>
              <MDBadge
                badgeContent={video.privacy}
                color={video.privacy === "public" ? "success" : "dark"}
                variant="gradient"
                size="sm"
              />
            </MDBox>
          ),
          uploaded: (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
              {getRelativeDate(video.timestamp)}
            </MDTypography>
          ),
          action: (
            <Grid container columnSpacing={1}>
              <Grid item>
                <Tooltip title="Edit">
                  <MDButton
                    variant="outlined"
                    onClick={() => handleEditClick(video._id)}
                    circular
                    color="info"
                    iconOnly
                  >
                    <Icon>mode_edit</Icon>
                  </MDButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Delete">
                  <MDButton
                    variant="outlined"
                    onClick={() => handleDeleteClick(video._id)}
                    circular
                    color="error"
                    iconOnly
                  >
                    <Icon>clear</Icon>
                  </MDButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Watch video">
                  <MDButton
                    variant="outlined"
                    onClick={() => handleViewClick(video._id)}
                    circular
                    color="success"
                    iconOnly
                  >
                    <Icon>visibility</Icon>
                  </MDButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Analytics">
                  <MDButton
                    variant="outlined"
                    onClick={() => handleAnalyticsClick(video._id)}
                    circular
                    color="info"
                    iconOnly
                  >
                    <Icon>assessment</Icon>
                  </MDButton>
                </Tooltip>
              </Grid>
            </Grid>
          ),
        }))
      : [],
  };
}
