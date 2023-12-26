// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import PropTypes from "prop-types";
import { getRelativeDate } from "functions/general/time";
import MDProgress from "components/MDProgress";

export default function data({ videoList }) {
  const Video = ({ image, name }) => (
    <MDBox
      display="flex"
      alignItems="center"
      lineHeight={1}
      style={{ cursor: "pointer" }} // Add this line for the pointer cursor
    >
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
  Video.propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
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

  return {
    columns: videoList
      ? [
          { Header: "video Title", accessor: "video", width: "45%", align: "left" },
          { Header: "Total views", accessor: "views", align: "center" },
          { Header: "uploaded date", accessor: "uploaded", align: "center" },
          { Header: "Likes", accessor: "likes", align: "center" },
        ]
      : [],

    rows: videoList
      ? videoList.map((video) => ({
          video: <Video image={video.poster[0].url} name={video.title} />,
          views: (
            <MDBox ml={-1}>
              <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {video.viewsCount}
              </MDTypography>
            </MDBox>
          ),
          uploaded: (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
              {getRelativeDate(video.timestamp)}
            </MDTypography>
          ),
          likes: (
            <MDBox width="8rem" textAlign="left">
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
        }))
      : [],
  };
}
