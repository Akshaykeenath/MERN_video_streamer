import { Grid, Icon } from "@mui/material";
import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import burceMars from "assets/images/bruce-mars.jpg";
import { useState } from "react";
import { Link } from "react-router-dom";
import MDButton from "components/MDButton";
import PropTypes from "prop-types";

export function RowDetails({ videoName, col1, col2, col3 }) {
  const [hover, setHover] = useState(false);
  return (
    <MDBox
      my={1}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      bgColor={hover ? "light" : "transparent"}
      sx={{ borderRadius: "10px" }}
    >
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={11}>
          <Link to="#">
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              px={3}
              alignItems="center"
            >
              <Grid item>
                <Grid container direction="row" columnSpacing={1} alignItems="center">
                  <Grid item>
                    <MDAvatar src={burceMars} alt="profile-image" size="sm" shadow="sm" />
                  </Grid>
                  <Grid item>
                    <MDTypography variant="h6" color="text">
                      {videoName}
                    </MDTypography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <MDTypography variant="h6" color="text">
                  {col1}
                </MDTypography>
              </Grid>
              <Grid item>
                <MDTypography variant="h6" color="text">
                  {col2}
                </MDTypography>
              </Grid>
              <Grid item>
                <MDTypography variant="h6" color="text">
                  {col3}
                </MDTypography>
              </Grid>
            </Grid>
          </Link>
        </Grid>
        <Grid item xs={1}>
          <Grid container justifyContent="center">
            <Grid item>
              {hover && (
                <MDButton variant="text" color="text" size="medium" circular iconOnly>
                  <Icon fontSize="medium" baseClassName="material-icons">
                    more_vert
                  </Icon>
                </MDButton>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MDBox>
  );
}

RowDetails.propTypes = {
  videoName: PropTypes.string,
  col1: PropTypes.string,
  col2: PropTypes.string,
  col3: PropTypes.string,
};
