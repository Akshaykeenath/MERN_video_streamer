import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";

function DescriptionArea() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  return (
    <MDBox p={1}>
      <MDBox bgColor={darkMode ? "rgb(0,0,0,0.4)" : "rgb(0,0,0,0.2)"} borderRadius="lg" shadow="lg">
        <Grid
          container
          width="100%"
          direction="column"
          justifyContent="flex-start"
          rowGap={2}
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
                  1000k views
                </MDTypography>
              </Grid>
              <Grid item>
                <MDTypography color="dark" variant="button" fontWeight="medium">
                  1 month ago
                </MDTypography>
              </Grid>
            </Grid>
          </Grid>
          {/* End View Count and Publish Date Area  */}

          {/* User Description Area */}
          <Grid item>
            <Grid container width="100%" direction="column" justifyContent="flex-start" rowGap={1}>
              <Grid item>
                <MDTypography color="dark" variant="button">
                  ബാലുവിനെ കാണാൻ ഉറ്റചങ്ങാതി ഫിലിപ്സ് എത്തുന്നു. നാട്ടിലേക്ക് താമസം മാറ്റുകയാണ്
                  ഫിലിപ്സ്. പിശുക്കൻ ഫിലിപ്സിന്റെ മോഹം ഹൈമവതിയുടെ വീടാണ്. ഫിലിപ്സിന് വീട് കിട്ടുമോ
                  എന്നറിയാൻ കാണുക, ഉപ്പും മുളകും
                </MDTypography>
              </Grid>
              <Grid item>
                <MDTypography color="dark" variant="button">
                  Balus close friend Philips is here to visit him. Phlips is shifting places. But
                  his aim is Himavathis house. Keep watching Uppum Mulakum to find out whether he
                  gets the house or not. #uppummulakum2
                </MDTypography>
              </Grid>
              <Grid item>
                <MDTypography color="dark" variant="button">
                  #uppummulakum2
                </MDTypography>
              </Grid>
            </Grid>
          </Grid>
          {/* End User Description Area */}
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default DescriptionArea;
