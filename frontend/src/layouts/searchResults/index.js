// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import StudioNavbar from "examples/Navbars/StudioNavbar";
import VideoCardListLarge from "examples/Cards/VideoCards/VideoListCardsLarge";
import VideoCardList from "examples/Cards/VideoCards/VideoListCards";
import { CircularProgress, Grid, useMediaQuery } from "@mui/material";
import MDTypography from "components/MDTypography";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSearchVideoResults } from "services/videoManagement";
import { formatCountToKilos } from "functions/general/count";
import { getRelativeTime } from "functions/general/time";

function SearchResults() {
  const { search } = useLocation();
  const [videoDataList, setVideoDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchQuery = new URLSearchParams(search).get("search_query");
  const decodedSearchQuery = searchQuery ? decodeURIComponent(searchQuery) : "";
  const { fetchData, response, error } = getSearchVideoResults();
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
    setLoading(true);
    setVideoDataList([]);
    fetchData(decodedSearchQuery);
  }, [decodedSearchQuery]);

  useEffect(() => {
    if (response && response.message) {
      setVideoDataList(response.message);
      setLoading(false);
    }
    if (error) {
      console.log(error);
      setLoading(false);
    }
  }, [response, error]);

  return (
    <DashboardLayout>
      <StudioNavbar />
      <MDTypography color="dark" fontWeight="medium" variant="h5" my={2}>
        Search Results
      </MDTypography>
      <Grid container direction="column" rowGap={1}>
        {(loading || videoDataList.length == 0) && (
          <Grid item>
            <Grid container justifyContent="center" alignItems="center" height="70vh" width="100%">
              {loading ? (
                <Grid item>
                  <CircularProgress color="inherit" />
                </Grid>
              ) : (
                <Grid item>
                  <MDTypography color="text" variant="h4">
                    No video found
                  </MDTypography>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
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
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default SearchResults;
