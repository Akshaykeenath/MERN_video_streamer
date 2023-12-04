import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ChannelVideoCard from "examples/Cards/VideoCards/ChannelVideoCards";
import { formatCountToKilos } from "functions/general/count";
import { getRelativeTime } from "functions/general/time";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function ChannelBodyArea({ videos }) {
  const [videoData, setVideoData] = useState(null);
  useEffect(() => {
    if (videos) {
      setVideoData(videos);
    }
  }, [videos]);

  return (
    <MDBox>
      <MDTypography color="text"> Videos</MDTypography>
      <Grid container direction="row" mt={1} columnSpacing={2} rowSpacing={3} mb={3}>
        {videoData &&
          videoData.map((video, index) => (
            <Grid item key={video._id}>
              <ChannelVideoCard
                video={{
                  poster: video.poster[0]?.url || "", // Assuming there's always at least one poster
                  url: video.video[0]?.url || "", // Assuming there's always at least one video
                }} // Assuming the video array contains only one video object
                title={video.title}
                views={formatCountToKilos(video.viewsCount) + " " + "views"} // Convert viewsCount to a string
                time={getRelativeTime(video.timestamp)} // Assuming timestamp is the time for the video
                action={{ type: "internal", route: `/video/${video._id}` }} // Update the route as needed
              />
            </Grid>
          ))}
      </Grid>
    </MDBox>
  );
}

ChannelBodyArea.propTypes = {
  videos: PropTypes.any,
};

export default ChannelBodyArea;
