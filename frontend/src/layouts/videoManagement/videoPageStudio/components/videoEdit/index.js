import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useRouteRedirect } from "services/redirection";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";
import {
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import PropTypes from "prop-types";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import KEVideoPlayer from "components/KEVideoPlayer";
import { useEffect, useState } from "react";
import { getVideoDataByID } from "services/videoManagement";
import { useMaterialUIController, setNotification } from "context";
import { apiUpdateVideo } from "services/videoManagement";

function VideoEdit({ videoId, onBackClick }) {
  const { response, error } = getVideoDataByID(videoId);
  const isXs = useMediaQuery((theme) => theme.breakpoints.up("xs"));
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [controller, dispatch] = useMaterialUIController();

  // states
  const [privacy, setPrivacy] = useState("private");
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [videoChip, setVideoChip] = useState("");
  const [videoChipList, setVideoChipList] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [updateLoad, setUpdateLoad] = useState(false);
  const [noChange, setNoChange] = useState(false);
  const [titleError, setTitleError] = useState(false);
  useEffect(() => {
    if (response && response.video) {
      setVideo(response.video);
    }
    if (error) {
      const noti = {
        message: "An Error occured",
        color: "error",
      };
      setNotification(dispatch, noti);
    }
  }, [response, error]);

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setDesc(video.desc);
      setPrivacy(video.privacy);
      setVideoChipList(video.tags);
      setVideoUrl(video.video[0].url);
    }
  }, [video]);

  useEffect(() => {
    if (video) {
      if (
        title === video.title &&
        desc === video.desc &&
        videoChipList === video.tags &&
        privacy === video.privacy
      ) {
        setNoChange(true);
      } else {
        setNoChange(false);
      }
    }
  }, [title, desc, privacy, videoChipList, video]);

  const handleBackClick = () => {
    onBackClick(true);
  };

  const videoData = {
    url: videoUrl,
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

  const handleUpdateClick = async () => {
    if (title.length === 0) {
      setTitleError("Enter a valid title");
    } else {
      setTitleError(false);
    }
    setUpdateLoad(true);
    if (title.length > 0) {
      const data = {
        id: video.id,
        title: title,
        desc: desc,
        privacy: privacy,
        tags: videoChipList,
      };

      try {
        const response = await apiUpdateVideo(data);

        if (response.status === "success") {
          handleBackClick();
          const noti = {
            message: "Update successful",
            color: "success",
          };
          setNotification(dispatch, noti);
        } else {
          // Handle error, e.g., show an error message
          console.error("Update failed", response.message);
          const noti = {
            message: "Update failed",
            color: "error",
          };
          setNotification(dispatch, noti);
        }
      } catch (error) {
        // Handle unexpected errors
        console.error("Unexpected error", error);
        const noti = {
          message: "Update failed",
          color: "error",
        };
        setNotification(dispatch, noti);
      }
    } else {
      const noti = {
        message: "Add a valid title",
        color: "error",
      };
      setNotification(dispatch, noti);
    }
    setUpdateLoad(false);
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-around"
      width="100%"
      rowSpacing={3}
      columnSpacing={3}
    >
      <Grid item textAlign="center">
        <MDTypography color="dark" variant="h3">
          Video Details
        </MDTypography>
      </Grid>

      {/* Main Area */}
      <Grid item width="100%">
        <Grid
          container
          direction="row"
          width="100%"
          justifyContent="center"
          alignItems="center"
          columnSpacing={1}
          rowSpacing={4}
        >
          {/* Left Side  */}
          <Grid item xs={12} md={8}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              rowSpacing={1}
              px={isMd ? 15 : 5}
            >
              <Grid item>
                {video ? (
                  <MDInput
                    label="Video title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    error={titleError.length > 0}
                    fullWidth
                  />
                ) : (
                  <Skeleton animation="wave" width="100%">
                    <MDInput
                      label="Video title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                      fullWidth
                    />
                  </Skeleton>
                )}
              </Grid>
              <Grid item>
                {video ? (
                  <MDInput
                    label="Video description"
                    value={desc}
                    onChange={(e) => {
                      setDesc(e.target.value);
                    }}
                    multiline
                    rows={5}
                    fullWidth
                  />
                ) : (
                  <Skeleton animation="wave" width="100%" height="100%">
                    <MDInput
                      label="Video description"
                      value={desc}
                      onChange={(e) => {
                        setDesc(e.target.value);
                      }}
                      multiline
                      rows={5}
                      fullWidth
                    />
                  </Skeleton>
                )}
              </Grid>
              <Grid item>
                {video ? (
                  <MDInput
                    label="Video tags"
                    value={videoChip}
                    onChange={(e) => setVideoChip(e.target.value)}
                    onKeyDown={handleVideoTagKeyDown}
                    fullWidth
                  />
                ) : (
                  <Skeleton animation="wave" width="100%">
                    <MDInput
                      label="Video tags"
                      value={videoChip}
                      onChange={(e) => setVideoChip(e.target.value)}
                      onKeyDown={handleVideoTagKeyDown}
                      fullWidth
                    />
                  </Skeleton>
                )}
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
          {/* End Left Side  */}

          {/* Right side  */}
          <Grid item xs={12} md={4}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              rowSpacing={2}
            >
              <Grid item>
                {videoUrl ? (
                  <KEVideoPlayer type="mini" video={videoData} />
                ) : (
                  <Skeleton animation="wave" width="100%">
                    <KEVideoPlayer type="mini" video={videoData} />
                  </Skeleton>
                )}
              </Grid>
              <Grid item>
                {video ? (
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
                ) : (
                  <Skeleton animation="wave" width="100%">
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
                  </Skeleton>
                )}
              </Grid>
            </Grid>
          </Grid>
          {/* End Right side  */}
        </Grid>
      </Grid>
      {/* End Main Area */}

      {/* Action Area */}
      <Grid item>
        <Grid container direction="row" justifyContent="flex-end" width="100%" columnSpacing={1}>
          <Grid item>
            <MDButton color="secondary" onClick={handleBackClick} circular>
              back
            </MDButton>
          </Grid>
          <Grid item>
            <MDButton
              color="info"
              onClick={handleUpdateClick}
              disabled={updateLoad || noChange}
              circular
            >
              Update&nbsp;
              {updateLoad && <CircularProgress color="inherit" size={15} />}
            </MDButton>
          </Grid>
        </Grid>
      </Grid>
      {/* End Action Area */}
    </Grid>
  );
}

VideoEdit.propTypes = {
  videoId: PropTypes.string,
  onBackClick: PropTypes.func,
};

export default VideoEdit;
