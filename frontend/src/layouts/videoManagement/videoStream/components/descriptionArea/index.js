import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { setMiniSidenav, useMaterialUIController } from "context";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { formatCountToKilos } from "functions/general/count";
import { formatCountToIndian } from "functions/general/count";
import { getRelativeTime } from "functions/general/time";
import { getRelativeDate } from "functions/general/time";
import { getRelativeDateMonth } from "functions/general/time";

function DescriptionArea({ description, views, date }) {
  const [controller, dispatch] = useMaterialUIController();
  const { darkMode } = controller;
  const [seeMore, setSeeMore] = useState(false);
  const [desArray, setDesArray] = useState([]);
  const [modifiedDes, setModifiedDes] = useState("");
  useEffect(() => {
    if (modifiedDes.length > 0) {
      setDesArray(modifiedDes.split("\n"));
    }
  }, [modifiedDes]);

  useEffect(() => {
    if (description.length > 50 && !seeMore) {
      let modifeddes = description.slice(0, 50);
      if (modifeddes.indexOf("\n") >= 0) {
        const index = modifeddes.indexOf("\n");
        modifeddes = description.slice(0, index);
      }
      setModifiedDes(modifeddes + "....");
    } else {
      setModifiedDes(description);
    }
  }, [description, seeMore]);

  return (
    <MDBox p={1}>
      <MDBox
        bgColor={darkMode ? "rgb(0,0,0,0.4)" : "rgb(0,0,0,0.2)"}
        borderRadius="lg"
        shadow="lg"
        sx={{ "&:hover": { cursor: seeMore ? "default" : "pointer" } }}
        onClick={() => {
          setSeeMore(true);
        }}
      >
        <Grid
          container
          width="100%"
          direction="column"
          justifyContent="flex-start"
          rowGap={1}
          p={2}
        >
          {/* View Count and Publish Date Area  */}
          <Grid item>
            <Grid
              container
              width="100%"
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              columnGap={2}
            >
              <Grid item>
                <MDTypography color="dark" variant="button" fontWeight="medium">
                  {seeMore ? formatCountToIndian(views) : formatCountToKilos(views)} views
                </MDTypography>
              </Grid>
              <Grid item>
                <MDTypography color="dark" variant="button" fontWeight="medium">
                  {seeMore ? getRelativeDateMonth(date) : getRelativeTime(date)}
                </MDTypography>
              </Grid>
            </Grid>
          </Grid>
          {/* End View Count and Publish Date Area  */}

          {/* User Description Area */}
          <Grid item>
            <Grid container width="100%" direction="column" justifyContent="flex-start" rowGap={1}>
              {desArray.map((des, index) => (
                <Grid item key={index}>
                  {/* Added key attribute for each item */}
                  <MDTypography color="dark" variant="button">
                    {des}
                  </MDTypography>
                </Grid>
              ))}
            </Grid>
          </Grid>
          {/* End User Description Area */}
        </Grid>
        {description.length > 50 && (
          <Grid item>
            <MDButton
              variant="text"
              size="small"
              color={darkMode ? "white" : "dark"}
              onClick={(e) => {
                e.stopPropagation();
                setSeeMore(!seeMore);
              }}
              disableRipple
            >
              {seeMore ? "see less" : "...more"}
            </MDButton>
          </Grid>
        )}
      </MDBox>
    </MDBox>
  );
}

DescriptionArea.defaultProps = {
  description: " ",
  views: "100k",
  date: "1 month ago",
};

// Typechecking props for the MDButton
DescriptionArea.propTypes = {
  description: PropTypes.string,
  views: PropTypes.number,
  date: PropTypes.string,
};
export default DescriptionArea;
