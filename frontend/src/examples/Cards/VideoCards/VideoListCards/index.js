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
import { Grid, Tooltip, useMediaQuery } from "@mui/material";

function VideoCardList({ title, channel, views, time, action }) {
  const breakpointSizes = {
    xs: "xs",
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
    xxl: "xxl",
    // Add more sizes as needed
  };

  const mediaQueries = {};

  Object.keys(breakpointSizes).forEach((size) => {
    mediaQueries[size] = useMediaQuery((theme) => theme.breakpoints.only(breakpointSizes[size]));
  });

  // Now you can access your variables like this:
  const isXs = mediaQueries.xs;
  const isSm = mediaQueries.sm;
  const isMd = mediaQueries.md;
  const isLg = mediaQueries.lg;
  const isXl = mediaQueries.xl;
  const isXxl = mediaQueries.xxl;

  const navigate = useNavigate();
  const modifiedChannelName = () => {
    if (channel.name.length > 30) {
      return channel.name.slice(0, 30) + "...";
    } else {
      return channel.name;
    }
  };
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

  const handleChannelClick = (event) => {
    // Prevent the card click event from firing when clicking on the channel link
    event.stopPropagation();
  };

  const containerStyle = {
    position: "relative",
    width: "100%", // Set the width of the container as needed
    aspectRatio: "16 / 9", // 16:9 aspect ratio
    borderRadius: "16px",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };
  return (
    <Card onClick={handleClick} sx={{ cursor: "pointer" }}>
      <Grid container direction="row" columnSpacing={2}>
        <Grid item xs={6} md={6}>
          <MDBox style={containerStyle} p={1}>
            <MDBox
              component="img"
              src={"https://picsum.photos/id/237/3000/3000"}
              alt="Poster"
              borderRadius="lg"
              shadow="md"
              width="100%"
              height="100%"
              position="relative"
              sx={imageStyle}
              mb={-2}
            />
          </MDBox>
        </Grid>
        {/* Details area */}
        <Grid item xs={6} md={6}>
          <Grid container direction="column">
            <Grid item>
              <MDBox>
                <Tooltip title={title}>
                  <MDTypography display="inline" variant="h6" fontWeight="bold">
                    {modifiedTitle()}
                  </MDTypography>
                </Tooltip>
              </MDBox>
            </Grid>
            <Grid item>
              <MDTypography
                variant="body2"
                color="text"
                fontWeight="medium"
                sx={{ "&:hover": { textDecoration: "underline" } }}
              >
                <Link to={channel.route} onClick={handleChannelClick} style={{ color: "inherit" }}>
                  {modifiedChannelName()}
                </Link>
              </MDTypography>
            </Grid>
            <Grid item>
              <MDTypography variant="button" color="text" fontWeight="light" verticalAlign="middle">
                {views} • {time}
              </MDTypography>
            </Grid>
          </Grid>
        </Grid>
        {/* End Details area */}
      </Grid>
    </Card>
  );
}

// Typechecking props for the SimpleBlogCard
VideoCardList.propTypes = {
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

export default VideoCardList;
