// Material Dashboard 2 React example components
import VideoCardListLarge from "examples/Cards/VideoCards/VideoListCardsLarge";
import PropTypes from "prop-types";
import VideoCardList from "examples/Cards/VideoCards/VideoListCards";
import { Grid, useMediaQuery } from "@mui/material";
import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react";
import { formatCountToKilos } from "functions/general/count";
import { getRelativeTime } from "functions/general/time";
import MDBox from "components/MDBox";

function VideoList({ videoList, title }) {
  const [videoDataList, setVideoDataList] = useState([]);
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

  useEffect(() => {
    if (videoList) {
      setVideoDataList(videoList);
    }
  }, [videoList]);

  return (
    <MDBox>
      <MDTypography color={title.color} fontWeight="medium" variant={title.variant} my={2}>
        {title.text}
      </MDTypography>
      <Grid container direction="column" rowGap={1}>
        {(isLg || isXl || isXxl) &&
          videoDataList.length > 0 &&
          videoDataList.map((videoData, index) => (
            <Grid item key={index}>
              <VideoCardListLarge
                poster={videoData.poster[0].url}
                title={videoData.title}
                channel={{
                  name: videoData.uploader.fname + " " + videoData.uploader.lname,
                  route: `/channel/${videoData.uploader._id}`,
                }}
                views={formatCountToKilos(videoData.viewsCount) + " " + "views"}
                time={getRelativeTime(videoData.timestamp)}
                description={videoData.desc}
                action={{
                  type: "internal",
                  route: `/video/${videoData._id}`, // Assuming you want to generate a route based on the index
                }}
              />
            </Grid>
          ))}
        {(isXs || isSm || isMd) &&
          videoDataList.length > 0 &&
          videoDataList.map((videoData, index) => (
            <Grid item key={index}>
              <VideoCardList
                poster={videoData.poster[0].url}
                title={videoData.title}
                channel={{
                  name: videoData.uploader.fname + " " + videoData.uploader.lname,
                  route: `/channel/${videoData.uploader._id}`,
                }}
                views={formatCountToKilos(videoData.viewsCount) + " " + "views"}
                time={getRelativeTime(videoData.timestamp)}
                action={{
                  type: "internal",
                  route: `/video/${videoData._id}`, // Assuming you want to generate a route based on the index
                }}
              />
            </Grid>
          ))}
      </Grid>
    </MDBox>
  );
}

VideoList.propTypes = {
  videoList: PropTypes.array.isRequired,
  title: PropTypes.shape({
    variant: PropTypes.string,
    text: PropTypes.string,
    color: PropTypes.string,
  }),
};

VideoList.defaultProps = {
  videoList: [],
  title: {
    variant: "h5",
    text: "",
    color: "dark",
  },
};

export default VideoList;
