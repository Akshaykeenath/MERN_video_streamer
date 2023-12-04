import { CircularProgress, Grid, Skeleton } from "@mui/material";
import VideoCardList from "examples/Cards/VideoCards/VideoListCards";
import { useEffect, useState } from "react";
import { getRelatedVideos } from "services/videoManagement";
import PropTypes from "prop-types";
import { formatCountToKilos } from "functions/general/count";
import { getRelativeTime } from "functions/general/time";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

function RelatedVideoList({ videoId }) {
  const { fetchData, response, error } = getRelatedVideos();
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (response) {
      setVideoData(response.message);
      setLoading(false);
    }
    if (error) {
      console.log(error);
      setLoading(false);
    }
  }, [response, error]);

  useEffect(() => {
    setLoading(true);
    setVideoData(null);
    fetchData(videoId);
  }, [videoId]);

  // Loading skelton animation
  const loadingSkeltons = (numberOfTimes) => {
    const skeletons = [];

    for (let i = 0; i < numberOfTimes; i++) {
      skeletons.push(
        <Grid item key={i} my={-2}>
          <Grid
            container
            direction="row"
            columnSpacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={6} md={6}>
              <MDBox p={1}>
                <Skeleton animation="wave" height="20vh" />
              </MDBox>
            </Grid>
            {/* Details area */}
            <Grid item xs={6} md={6}>
              <Grid container direction="column">
                <Grid item>
                  <Skeleton animation="wave" height="100%" />
                </Grid>
                <Grid item>
                  <Skeleton animation="wave" height="100%" />
                </Grid>
                <Grid item>
                  <Skeleton animation="wave" height="100%" />
                </Grid>
              </Grid>
            </Grid>
            {/* End Details area */}
          </Grid>
        </Grid>
      );
    }

    return skeletons;
  };
  // End Loading skelton animation

  return (
    <MDBox>
      <MDBox
        mt={-3}
        mb={1}
        py={1}
        px={2}
        variant="gradient"
        bgColor="secondary"
        borderRadius="lg"
        coloredShadow="info"
      >
        <MDTypography variant="h6" color="white">
          Related Videos
        </MDTypography>
      </MDBox>
      <Grid container direction="column" rowSpacing={1}>
        {loading && loadingSkeltons(3)}
        {!loading &&
          videoData &&
          videoData.map((video) => (
            <Grid item key={video._id}>
              <VideoCardList
                poster={video.poster[0].url}
                title={video.title}
                views={formatCountToKilos(video.viewsCount) + " " + "views"}
                time={getRelativeTime(video.timestamp)}
                channel={{
                  name: video.uploader.fname + " " + video.uploader.lname,
                  route: `/channel/${video.uploader._id}`,
                }}
                action={{
                  type: "internal",
                  route: `/video/${video._id}`,
                }}
                description={video.desc}
              />
            </Grid>
          ))}
      </Grid>
    </MDBox>
  );
}

RelatedVideoList.propTypes = {
  videoId: PropTypes.string,
};

export default RelatedVideoList;
