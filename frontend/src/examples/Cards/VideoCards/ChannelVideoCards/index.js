// react-router components
import { Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import MuiLink from "@mui/material/Link";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";
import { Grid, Tooltip } from "@mui/material";
import KEVideoPlayer from "components/KEVideoPlayer";

function ChannelVideoCard({ video, title, views, time, action }) {
  const navigate = useNavigate();
  const modifiedTitle = () => {
    if (title.length > 29) {
      return title.slice(0, 27) + "...";
    } else {
      return title;
    }
  };
  const handleClick = () => {
    if (action.type == "internal") {
      navigate(`${action.route}`);
    } else {
      navigate(`/${action.route}`);
    }
  };

  return (
    <Card onClick={handleClick} sx={{ cursor: "pointer", maxWidth: "340px" }}>
      <MDBox position="relative" borderRadius="lg" mt={-3} mx={2}>
        <MDBox position="relative" zIndex={1}>
          <KEVideoPlayer
            type="hover"
            video={video}
            sx={{ maxHeight: "180px", maxWidth: "350px" }}
          />
        </MDBox>
        <MDBox
          borderRadius="lg"
          shadow="md"
          width="100%"
          height="100%"
          position="absolute"
          left={0}
          top="3%"
          sx={{
            backgroundImage: `url(${video.poster})`,
            transform: "scale(0.94)",
            filter: "blur(12px)",
            backgroundSize: "cover",
          }}
        />
      </MDBox>
      <MDBox p={3} mt={-2} mb={-2}>
        <MDBox>
          <MDBox>
            <Tooltip title={title}>
              <MDTypography display="inline" variant="h6" fontWeight="bold">
                {modifiedTitle()}
              </MDTypography>
            </Tooltip>
          </MDBox>
          <MDBox mt={0}>
            <MDTypography variant="button" component="p" color="text">
              {views} ● {time}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Typechecking props for the SimpleBlogCard
ChannelVideoCard.propTypes = {
  video: PropTypes.shape({
    poster: PropTypes.string,
    url: PropTypes.string,
  }),
  title: PropTypes.string.isRequired,
  views: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  action: PropTypes.shape({
    type: PropTypes.oneOf(["external", "internal"]).isRequired,
    route: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChannelVideoCard;
