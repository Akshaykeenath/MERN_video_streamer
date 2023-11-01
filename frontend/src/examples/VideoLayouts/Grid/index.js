import MDTypography from "components/MDTypography";
import DefaultVideoCard from "examples/Cards/VideoCards/DefaultVideoCards";
import MDBox from "components/MDBox";
import { Icon, useMediaQuery } from "@mui/material";
import { Grid } from "@mui/material";
import PropTypes from "prop-types";
import MDPagination from "components/MDPagination";
import { useState } from "react";

function VideoGridLayout({ videos, title }) {
  const [currentPage, setCurrentPage] = useState(1);
  const isXs = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const isLg = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const perPage = 6; // Number of videos per page
  const totalPage = Math.ceil(videos.length / perPage);
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1);

  // Calculate the starting and ending indices for the current page
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  // Filter the videos to display based on the current page
  const videosToDisplay = videos.slice(startIndex, endIndex);

  // Set justifyContent based on breakpoints
  let justifyContentValue = "flex-start"; // Default value
  if (isXs) {
    justifyContentValue = "space-evenly"; // For xs
  } else if (isLg) {
    justifyContentValue = "space-evenly"; // For lg and up
  }

  return (
    <MDBox>
      <MDTypography
        variant={title.variant}
        color={title.color}
        fontWeight="bold"
        textTransform="capitalize"
        p={2}
        textGradient
      >
        {title.text}
      </MDTypography>
      <Grid container direction="row" justifyContent={justifyContentValue} mt={4} mb={2} rowGap={7}>
        {videosToDisplay.map((video, index) => (
          <Grid item key={index}>
            <DefaultVideoCard {...video} />
          </Grid>
        ))}
      </Grid>

      {/* Page numbers */}
      <MDPagination size="small" color="error" variant="gradient">
        <MDPagination
          item
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
          }}
        >
          <Icon>keyboard_arrow_left</Icon>
        </MDPagination>

        {pages.map((number) => (
          <MDPagination
            item
            key={number}
            active={number === currentPage}
            onClick={() => {
              setCurrentPage(number);
            }}
          >
            {number}
          </MDPagination>
        ))}
        <MDPagination
          item
          onClick={() => {
            if (currentPage < totalPage) {
              setCurrentPage(currentPage + 1);
            }
          }}
        >
          <Icon>keyboard_arrow_right</Icon>
        </MDPagination>
      </MDPagination>
    </MDBox>
  );
}

VideoGridLayout.propTypes = {
  title: PropTypes.shape({
    color: PropTypes.oneOf([
      "transparent",
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "light",
      "dark",
    ]),
    variant: PropTypes.string,
    text: PropTypes.string.isRequired,
  }),
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      video: PropTypes.shape({
        url: PropTypes.string,
        poster: PropTypes.string,
      }),
      title: PropTypes.string.isRequired,
      channel: PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
      }).isRequired,
      views: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      action: PropTypes.shape({
        type: PropTypes.oneOf(["external", "internal"]).isRequired,
        route: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default VideoGridLayout;
