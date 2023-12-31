import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setOpenConfigurator,
  setTransparentSidenav,
  setWhiteSidenav,
  setFixedNavbar,
  setSidenavColor,
  setDarkMode,
} from "context";
import { Grid, IconButton } from "@mui/material";
import MDButton from "components/MDButton";

function PlatformSettings() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    openConfigurator,
    fixedNavbar,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const sidenavColors = ["primary", "dark", "info", "success", "warning", "error"];

  const handleWhiteSideNav = () => {
    setWhiteSidenav(dispatch, true);
    setTransparentSidenav(dispatch, false);
  };

  const handleDarkSideNav = () => {
    setWhiteSidenav(dispatch, false);
    setTransparentSidenav(dispatch, false);
  };

  const handleTransparentSideNav = () => {
    setWhiteSidenav(dispatch, false);
    setTransparentSidenav(dispatch, true);
  };

  return (
    <Card sx={{ boxShadow: "none" }}>
      <MDBox p={2}>
        <MDTypography variant="h5" fontWeight="medium" textTransform="capitalize">
          platform settings
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Theme
        </MDTypography>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={darkMode} onChange={() => setDarkMode(dispatch, !darkMode)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Light / Dark
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={fixedNavbar} onChange={() => setFixedNavbar(dispatch, !fixedNavbar)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Navbar Fixed
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" flexDirection="column" alignItems="flex-start" mb={0.5}>
          <MDBox>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Sidenav Color
            </MDTypography>
          </MDBox>
          <MDBox mb={0.5}>
            {sidenavColors.map((color) => (
              <IconButton
                key={color}
                sx={({
                  borders: { borderWidth },
                  palette: { white, dark, background },
                  transitions,
                }) => ({
                  width: "24px",
                  height: "24px",
                  padding: 0,
                  border: `${borderWidth[1]} solid ${darkMode ? background.sidenav : white.main}`,
                  borderColor: () => {
                    let borderColorValue = sidenavColor === color && dark.main;

                    if (darkMode && sidenavColor === color) {
                      borderColorValue = white.main;
                    }

                    return borderColorValue;
                  },
                  transition: transitions.create("border-color", {
                    easing: transitions.easing.sharp,
                    duration: transitions.duration.shorter,
                  }),
                  backgroundImage: ({ functions: { linearGradient }, palette: { gradients } }) =>
                    linearGradient(gradients[color].main, gradients[color].state),

                  "&:not(:last-child)": {
                    mr: 1,
                  },

                  "&:hover, &:focus, &:active": {
                    borderColor: darkMode ? white.main : dark.main,
                  },
                })}
                onClick={() => setSidenavColor(dispatch, color)}
              />
            ))}
          </MDBox>
        </MDBox>
        <MDBox display="flex" flexDirection="column" alignItems="flex-start" mb={0.5}>
          <MDBox>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Sidenav Type
            </MDTypography>
          </MDBox>
          <Grid
            container
            direction="row"
            columnSpacing={1}
            alignItems="center"
            width="100%"
            mt={0.5}
          >
            <Grid item>
              <MDButton
                variant={!whiteSidenav && !transparentSidenav ? "gradient" : "outlined"}
                color={
                  darkMode ? (!whiteSidenav && !transparentSidenav ? "light" : "white") : "dark"
                }
                onClick={handleDarkSideNav}
                size="small"
              >
                Dark
              </MDButton>
            </Grid>
            <Grid item>
              <MDButton
                variant={transparentSidenav ? "gradient" : "outlined"}
                color={darkMode ? (transparentSidenav ? "light" : "white") : "dark"}
                onClick={handleTransparentSideNav}
                size="small"
              >
                Transparent
              </MDButton>
            </Grid>
            <Grid item>
              <MDButton
                variant={whiteSidenav ? "gradient" : "outlined"}
                color={darkMode ? (whiteSidenav ? "light" : "white") : "dark"}
                onClick={handleWhiteSideNav}
                size="small"
              >
                White
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default PlatformSettings;
