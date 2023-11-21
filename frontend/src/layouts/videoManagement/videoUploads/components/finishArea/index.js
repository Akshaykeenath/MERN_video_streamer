import { Card, Grid, useMediaQuery } from "@mui/material";
import MDProgress from "components/MDProgress";
import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRouteRedirect } from "services/redirection";
import { useMaterialUIController, setNotification } from "context";

function UploadFinishArea({ progress }) {
  const [controller, dispatch] = useMaterialUIController();
  const redirect = useRouteRedirect();
  const [finished, setFinished] = useState(false);
  const [progressColor, setProgressColor] = useState("warning");
  const [textColor, setTextColor] = useState("dark");

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

  useEffect(() => {
    if (progress <= 34) {
      setProgressColor("warning");
    } else if (progress <= 68) {
      setProgressColor("info");
    } else if (progress >= 100) {
      const noti = {
        message: "Video Upload Completed",
        color: "success",
      };
      setNotification(dispatch, noti);
      setFinished(true);
      setProgressColor("success");
      setTextColor("success");
      setTimeout(() => {
        redirect("videoDetailsStudio");
      }, 5000);
    }
  }, [progress]);
  return (
    <Card sx={{ height: isXs ? "max-content" : "82vh" }}>
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        alignItems="stretch"
        sx={{ height: "100%" }}
      >
        <Grid item xs={2}>
          <MDProgress value={progress} color={progressColor} variant="gradient" label />
        </Grid>
        <Grid item xs={10}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%" }}
          >
            <Grid item>
              <MDTypography textGradient={textColor === "success"} color={textColor} variant="h3">
                {finished ? "Successfully Uploaded" : "Uploading"}
              </MDTypography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}

UploadFinishArea.propTypes = {
  progress: PropTypes.number,
};
export default UploadFinishArea;
