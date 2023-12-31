import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
  navbarDesktopMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import { useRouteRedirect } from "services/redirection";
import KESlideModal from "components/KEModals/SlideModal";

function DashboardNavbar({ absolute, light, isMini }) {
  const { pathname } = useLocation();
  const redirect = useRouteRedirect();
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [appDomain, setAppDomain] = useState("default");
  const [modalData, setModalData] = useState(null);

  const route = useLocation().pathname.split("/").slice(1);

  useEffect(() => {
    if (pathname.startsWith("/studio")) {
      setAppDomain("studio");
    } else {
      setAppDomain("default");
    }
  }, [pathname]);

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleOpenProfile = (event) => setOpenProfile(event.currentTarget);
  const handleCloseProfile = () => setOpenProfile(false);
  const handleCloseMenu = () => setOpenMenu(false);
  const handleStudioClick = () => {
    if (appDomain === "default") {
      setAppDomain("studio");
      redirect("dashboard");
    } else {
      setAppDomain("default");
      redirect("home");
    }
  };

  // Log out modal Code

  const handleLogout = () => {
    setModalData({
      title: "Confirm ?",
      body: "Are you sure you want to logout ?",
      buttons: [
        { color: "success", label: "No", value: "no" },
        { color: "error", label: "Yes", value: "yes" },
      ],
      onAction: handleModalAction,
    });
  };

  useEffect(() => {
    if (modalData && modalData.onAction) {
      if (modalData.actionValue === "yes") {
        redirect("logout");

        // Perform the delete operation here
        setModalData(null);
      }
    }
  }, [modalData]);

  const handleModalAction = (value) => {
    if (value === "yes") {
      setModalData((prevData) => ({ ...prevData, actionValue: value }));
    } else {
      // For "No" or other cases, just close the modal
      setModalData(null);
    }
  };

  // End Log out modal Code

  const renderProfileMenu = () => (
    <Menu
      anchorEl={openProfile}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openProfile)}
      onClose={handleCloseProfile}
      sx={{ mt: 2 }}
    >
      <NotificationItem
        icon={<Icon>person</Icon>}
        title="Profile"
        onClick={() => redirect("profile")}
      />
      <NotificationItem
        icon={appDomain === "default" ? <Icon>video_call</Icon> : <Icon>ondemand_video</Icon>}
        onClick={handleStudioClick}
        title={appDomain === "default" ? "Studio" : "KeTube"}
      />
      <NotificationItem icon={<Icon>logout</Icon>} onClick={handleLogout} title="Logout" />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs
            icon="home"
            title={route[route.length - 1]}
            route={route.slice(route[0] === "studio" ? 1 : 0)}
            light={light}
          />
          <IconButton
            size="small"
            disableRipple
            color="inherit"
            sx={navbarDesktopMenu}
            onClick={handleMiniSidenav}
          >
            <Icon sx={iconsStyle} fontSize="medium">
              {miniSidenav ? "menu_open" : "menu"}
            </Icon>
          </IconButton>
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <IconButton
                sx={navbarIconButton}
                size="small"
                onClick={handleOpenProfile}
                disableRipple
              >
                <Icon sx={iconsStyle}>account_circle</Icon>
              </IconButton>
              {renderProfileMenu()}
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
      {modalData && (
        <KESlideModal
          title={modalData.title}
          body={modalData.body}
          onAction={modalData.onAction}
          buttons={modalData.buttons}
        />
      )}
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
