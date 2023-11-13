import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function VideoPageStudio() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <MDBox>
          <MDTypography color=" text"> Video main page </MDTypography>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
}

export default VideoPageStudio;
