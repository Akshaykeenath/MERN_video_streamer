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

function VideoCardList({ video, title, channel, views, time, action }) {
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
        <Grid item xs={6} md={3}>
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
        <Grid item xs={6} md={9}>
          <Grid container direction="column">
            <Grid item>
              <MDBox>
                <Tooltip title={title}>
                  <MDTypography display="inline" variant="h5" fontWeight="bold">
                    {modifiedTitle()}
                  </MDTypography>
                </Tooltip>
              </MDBox>
            </Grid>
            <Grid item>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                columnSpacing={1}
              >
                <Grid item>
                  <MDTypography
                    variant="body2"
                    color="text"
                    fontWeight="medium"
                    sx={{ "&:hover": { textDecoration: "underline" } }}
                  >
                    <Link
                      to={channel.route}
                      onClick={handleChannelClick}
                      style={{ color: "inherit" }}
                    >
                      {modifiedChannelName()}
                    </Link>
                  </MDTypography>
                </Grid>
                <Grid item>
                  <MDTypography
                    variant="button"
                    color="text"
                    fontWeight="light"
                    verticalAlign="middle"
                  >
                    {views} • {time}
                  </MDTypography>
                </Grid>
              </Grid>
            </Grid>
            {/* Description */}
            <Grid item>
              <MDTypography variant="button" color="text" fontWeight="light" verticalAlign="middle">
                It was raining goals in #Kochi as #KBFCCFC ended in a draw after a feisty contest!
                🤝 #ISL #ISL10 #LetsFootball #ISLonJioCinema #ISLonSports18 #KeralaBlasters
                #ChennaiyinFC Follow all the match highlights & updates on our official YouTube
                channel. Like, Comment and Subscribe and make sure to click on the bell icon. To
                subscribe,
              </MDTypography>
            </Grid>
            {/* End Description */}
          </Grid>
        </Grid>
        {/* End Details area */}
      </Grid>
    </Card>
  );
}

// Typechecking props for the SimpleBlogCard
VideoCardList.propTypes = {
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

export default VideoCardList;
