import {
  Grid,
  useMediaQuery,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import KEVideoPlayer from "components/KEVideoPlayer";
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useMaterialUIController, setNotification } from "context";

function VideoUploadDetailsArea({ onVideoDetails, url, videoDetails }) {
  const [videoChip, setVideoChip] = useState("");
  const [videoChipList, setVideoChipList] = useState(videoDetails.tags);
  const [videoTitle, setVideoTitle] = useState(videoDetails.title);
  const [videoDesc, setVideoDesc] = useState(videoDetails.desc);
  const [controller, dispatch] = useMaterialUIController();
  const [privacy, setPrivacy] = useState(videoDetails.privacy);

  useEffect(() => {
    if (videoTitle.length > 0 || videoDesc.length > 0 || videoChipList.length > 0) {
      const videoData = {
        title: videoTitle,
        desc: videoDesc,
        tags: videoChipList,
        privacy: privacy,
      };

      onVideoDetails(videoData);
    }
  }, [videoTitle, videoDesc, videoChipList, privacy]);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const video = {
    url: url,
  };

  const handleVideoTagKeyDown = (e) => {
    if (e.key === "Enter") {
      // Prevent the default Enter key behavior (form submission)
      e.preventDefault();

      if (videoChip.trim() !== "") {
        if (videoChipList.length >= 20) {
          const noti = {
            message: "Only 20 tags are allowed",
            color: "error",
          };
          setNotification(dispatch, noti);
          setVideoChip("");
        } else {
          setVideoChipList([...videoChipList, videoChip]);
          setVideoChip("");
        }
      }
    }
  };

  const handleChipDelete = (chipToDelete) => {
    setVideoChipList((chips) => chips.filter((chip) => chip !== chipToDelete));
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
      <MDBox
        p={3}
        sx={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        <Grid container direction="column" justifyContent="space-around" alignItems="center">
          <Grid item>
            <KEVideoPlayer
              type="mini"
              sx={{ maxHeight: "250px", maxWidth: "350px" }}
              video={video}
            />
          </Grid>
          <Grid item>
            <FormControl sx={{ m: 3, minWidth: "10vw", height: "10vh" }}>
              <InputLabel id="demo-simple-select-helper-label">Privacy</InputLabel>
              <Select
                style={{ height: "50px" }}
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={privacy}
                label="Privacy"
                onChange={(e) => {
                  setPrivacy(e.target.value);
                }}
              >
                <MenuItem value={"private"}>Private</MenuItem>
                <MenuItem value={"public"}>Public</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
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
              <MDInput
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                label="Video Title"
                fullWidth
              />
            </Grid>
          </Grid>
          {/* second row  */}
          <Grid item container direction="row" spacing={2} sx={{ width: "100%" }}>
            <Grid item sx={{ width: "100%" }}>
              <MDInput
                type="text"
                multiline
                rows={5}
                label="Video Description"
                value={videoDesc}
                onChange={(e) => setVideoDesc(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item sx={{ width: "100%" }}>
              <MDInput
                type="text"
                label="Video Tags"
                value={videoChip}
                onChange={(e) => setVideoChip(e.target.value)}
                onKeyDown={handleVideoTagKeyDown}
                fullWidth
              />
              {videoChipList.map((chip, index) => (
                <Chip
                  key={index}
                  label={chip}
                  color="success"
                  onDelete={() => handleChipDelete(chip)}
                  style={{ margin: "4px" }}
                />
              ))}
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

VideoUploadDetailsArea.propTypes = {
  onVideoDetails: PropTypes.func, // Assuming videoData is an object
  url: PropTypes.string,
  videoDetails: PropTypes.object,
};

export default VideoUploadDetailsArea;
