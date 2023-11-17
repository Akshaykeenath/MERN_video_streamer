import { Grid } from "@mui/material";
import KEVideoPlayer from "components/KEVideoPlayer";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useMaterialUIController, setNotification } from "context";

function VideoPublishArea({ url, onVideoPublish }) {
  const [controller, dispatch] = useMaterialUIController();
  const [poster, setPoster] = useState(null);
  const [posterUrl, setPosterUrl] = useState(null);

  useEffect(() => {
    const fileInput = document.getElementById("file-input");
    if (poster !== null) {
      const fileType = poster.type;
      if (fileType.startsWith("image/")) {
        setPosterUrl(URL.createObjectURL(poster));
        onVideoPublish(poster);
      } else {
        const noti = {
          message: "Upload an Image file",
          color: "error",
        };
        setNotification(dispatch, noti);
        fileInput.value = "";
        setPoster(null);
      }
    }
  }, [poster]);
  const video = {
    url: url,
  };
  return (
    <Grid container direction="row" justifyContent="space-around" alignItems="center" height="100%">
      <Grid item>
        <MDBox>
          <KEVideoPlayer
            type="mini"
            video={video}
            sx={{
              maxWidth: "700px",
              maxHeight: "400px",
            }}
          />
        </MDBox>
      </Grid>
      <Grid item sx={{ display: "grid", height: "100%" }}>
        <Grid container direction="column" justifyContent="center" alignItems="center" rowGap={4}>
          <Grid item>
            <MDTypography color="text" fontWeight="bold">
              Select Thumbnail
            </MDTypography>
          </Grid>
          <Grid
            item
            container
            direction="column"
            justifyContent="space-around"
            alignItems="center"
            rowGap={2}
          >
            <Grid item>
              {posterUrl && (
                <MDBox
                  component="img"
                  src={posterUrl}
                  alt="image"
                  borderRadius="lg"
                  shadow="md"
                  width="100%"
                  height="100%"
                  maxWidth="300px"
                  maxHeight="280px"
                  position="relative"
                  zIndex={1}
                />
              )}
            </Grid>
            <Grid item>
              <MDInput
                accept="video/*"
                id="file-input"
                type="file"
                onChange={(e) => {
                  setPoster(e.target.files[0]);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

VideoPublishArea.propTypes = {
  onVideoPublish: PropTypes.func,
  url: PropTypes.string,
};
export default VideoPublishArea;
