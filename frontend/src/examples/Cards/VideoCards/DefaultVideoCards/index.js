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
import { Grid } from "@mui/material";
import KEVideoPlayer from "components/KEVideoPlayer";

function DefaultVideoCard({ video, title, channel, views, time, action }) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (action.type == "internal") {
      navigate(`${action.route}`);
    } else {
      navigate(`/${action.route}`);
    }
  };

  const handleChannelClick = (event) => {
    // Prevent the card click event from firing when clicking on the channel link
    event.stopPropagation();
  };

  return (
    <Card onClick={handleClick} sx={{ cursor: "pointer", maxWidth: "340px" }}>
      <MDBox position="relative" borderRadius="lg" mt={-3} mx={2}>
        <MDBox position="relative" zIndex={1} onClick={handleChannelClick}>
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
        <Grid
          container
          direction="row"
          columnSpacing={1}
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Link to={channel.route} onClick={handleChannelClick}>
              <MDBox>
                <MDAvatar src={channel.image} alt={channel.name} size="sm" shadow="xxl"></MDAvatar>
              </MDBox>
            </Link>
          </Grid>
          <Grid item>
            <MDBox>
              <MDBox>
                <MDTypography display="inline" variant="h6" fontWeight="bold">
                  {title}
                </MDTypography>
              </MDBox>
              <MDBox mt={0} mb={0}>
                <Link to={channel.route} onClick={handleChannelClick}>
                  <MDTypography
                    variant="body2"
                    component="p"
                    color="text"
                    sx={{ "&:hover": { textDecoration: "underline" } }}
                  >
                    {channel.name}
                  </MDTypography>
                </Link>
              </MDBox>
              <MDBox mt={0}>
                <MDTypography variant="button" component="p" color="text">
                  {views} ● {time}
                </MDTypography>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}

// Typechecking props for the SimpleBlogCard
DefaultVideoCard.propTypes = {
  video: PropTypes.shape({
    poster: PropTypes.string,
    url: PropTypes.string,
  }),
  title: PropTypes.string.isRequired,
  views: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  channel: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    route: PropTypes.string.isRequired,
  }).isRequired,
  action: PropTypes.shape({
    type: PropTypes.oneOf(["external", "internal"]).isRequired,
    route: PropTypes.string.isRequired,
  }).isRequired,
};

export default DefaultVideoCard;
