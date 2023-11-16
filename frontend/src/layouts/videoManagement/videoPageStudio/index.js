import { Card, Grid, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import VideoList from "./components/videoList";
import uploadVideoImg from "assets/images/addVideo.png";
import MDButton from "components/MDButton";
import { useRouteRedirect } from "services/redirection";

function VideoPageStudio() {
  const redirect = useRouteRedirect();
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid
        container
        columnSpacing={3}
        rowSpacing={1}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={9}>
          <VideoList />
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ paddingY: "5vh", paddingX: "3vw" }}>
            <Grid container direction="column" justifyContent="center" alignItems="center">
              <Grid item>
                <MDBox
                  component="img"
                  src={uploadVideoImg}
                  alt="Poster"
                  borderRadius="lg"
                  shadow="none"
                  width="100%"
                  height="100%"
                  maxWidth="200px"
                  position="relative"
                  zIndex={1}
                />
              </Grid>
              <Grid item>
                <MDButton
                  variant="outlined"
                  color="info"
                  size="large"
                  circular
                  onClick={() => {
                    redirect("videoUpload");
                  }}
                >
                  Add New Video&nbsp;
                  <Icon>add_circle_outline</Icon>
                </MDButton>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default VideoPageStudio;
