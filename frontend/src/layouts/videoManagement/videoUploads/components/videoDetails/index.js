import { Grid, useMediaQuery } from "@mui/material";
import KEVideoPlayer from "components/KEVideoPlayer";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";

function VideoUploadDetailsArea({ videoDetails, url }) {
  const isXs = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const video = {
    url: url,
    poster: "https://picsum.photos/300/180",
  };

  return (
    <MDBox
      sx={{
        display: "flex",
        flexDirection: isMd ? "row" : "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: "100%",
        borderRadius: "10px",
      }}
    >
      <MDBox p={3} sx={{ display: "flex", maxWidth: "350px" }}>
        <KEVideoPlayer type="mini" video={video} />
      </MDBox>
      <MDBox
        sx={{
          display: "flex",
          width: "70%",
          flexDirection: "column",
          justifyContent: "space-evenly",
          borderRadius: "10px",
        }}
      >
        <Grid container direction="column" spacing={2} sx={{ width: "100%" }}>
          <MDTypography color="text" fontWeight="bold" variant="h5">
            Enter Video Details
          </MDTypography>
          {/* First Row */}
          <Grid item container direction="row" spacing={2} sx={{ width: "100%" }}>
            <Grid item sx={{ width: "100%" }}>
              <MDInput type="text" label="Video Title" fullWidth />
            </Grid>
          </Grid>
          {/* second row  */}
          <Grid item container direction="row" spacing={2} sx={{ width: "100%" }}>
            <Grid item sx={{ width: "100%" }}>
              <MDInput type="text" multiline rows={5} label="Video Description" fullWidth />
            </Grid>
            <Grid item sx={{ width: "100%" }}>
              <MDInput type="text" label="Video Tags" multiline rows={2} fullWidth />
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

VideoUploadDetailsArea.propTypes = {
  videoDetails: PropTypes.func, // Assuming videoData is an object
  url: PropTypes.string,
};

export default VideoUploadDetailsArea;
