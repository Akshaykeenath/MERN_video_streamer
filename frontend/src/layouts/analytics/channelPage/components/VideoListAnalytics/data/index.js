// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import PropTypes from "prop-types";
import { getRelativeDate } from "functions/general/time";
import MDProgress from "components/MDProgress";
import { Grid, Icon, Tooltip } from "@mui/material";
import MDButton from "components/MDButton";

export default function data({ videoList, onVideoListAction }) {
  const Video = ({ image, name, onClick }) => (
    <MDBox
      display="flex"
      alignItems="center"
      lineHeight={1}
      sx={{
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography
          display="block"
          color="text"
          variant="button"
          fontWeight="medium"
          sx={{
            "&:hover": {
              color: "#1A73E8",
            },
          }}
        >
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

  const getLikesColor = (percentage) => {
    if (percentage > 75) {
      return "success";
    } else if (percentage >= 50 && percentage <= 75) {
      return "info";
    } else if (percentage >= 25 && percentage < 50) {
      return "warning";
    } else {
      return "error";
    }
  };

  const handleViewsClick = (id) => {
    const funcData = {
      action: "view",
      id: id,
    };
    onVideoListAction(funcData);
  };

  return {
    columns: videoList
      ? [
          { Header: "video Title", accessor: "video", width: "40%", align: "left" },
          { Header: "Total views", accessor: "views", align: "center" },
          { Header: "uploaded date", accessor: "uploaded", align: "center" },
          { Header: "Likes", accessor: "likes", align: "left" },
          { Header: "Actions", accessor: "action", align: "center" },
        ]
      : [],

    rows: videoList
      ? videoList.map((video) => ({
          video: (
            <Video
              image={video.poster[0].url}
              name={video.title}
              onClick={() => handleViewsClick(video._id)}
            />
          ),
          views: (
            <MDBox ml={-1} onClick={() => handleViewsClick(video._id)} sx={{ cursor: "pointer" }}>
              <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {video.viewsCount}
              </MDTypography>
            </MDBox>
          ),
          uploaded: (
            <MDTypography
              component="a"
              variant="caption"
              color="text"
              fontWeight="medium"
              sx={{ cursor: "pointer" }}
              onClick={() => handleViewsClick(video._id)}
            >
              {getRelativeDate(video.timestamp)}
            </MDTypography>
          ),
          likes: (
            <MDBox
              width="8rem"
              textAlign="left"
              onClick={() => handleViewsClick(video._id)}
              sx={{ cursor: "pointer" }}
            >
              <MDProgress
                value={
                  video.likesCount + video.dislikesCount > 0
                    ? Math.round(
                        (video.likesCount / (video.likesCount + video.dislikesCount)) * 100
                      )
                    : 0
                }
                color={getLikesColor(
                  video.likesCount + video.dislikesCount > 0
                    ? Math.round(
                        (video.likesCount / (video.likesCount + video.dislikesCount)) * 100
                      )
                    : 0
                )}
                variant="gradient"
                label={true}
              />
            </MDBox>
          ),
          action: (
            <Grid container columnSpacing={1}>
              <Grid item>
                <Tooltip title="View In Detail" placement="top">
                  <MDButton
                    variant="outlined"
                    circular
                    color="success"
                    iconOnly
                    onClick={() => handleViewsClick(video._id)}
                  >
                    <Icon>visibility</Icon>
                  </MDButton>
                </Tooltip>
              </Grid>
            </Grid>
          ),
        }))
      : [],
  };
}
