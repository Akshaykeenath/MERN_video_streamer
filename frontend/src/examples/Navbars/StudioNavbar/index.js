import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

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

// Custom styles for StudioNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
  navbarDesktopMenu,
} from "examples/Navbars/StudioNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import { useRouteRedirect } from "services/redirection";
import KESlideModal from "components/KEModals/SlideModal";
import { Grid } from "@mui/material";

function StudioNavbar({ absolute, light, isMini }) {
  const { pathname } = useLocation();
  const redirect = useRouteRedirect();
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [appDomain, setAppDomain] = useState("default");
  const [modalData, setModalData] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (pathname.startsWith("/studio")) {
      setAppDomain("studio");
    } else {
      setAppDomain("default");
    }
    if (pathname === "/results") {
      const searchQuery = new URLSearchParams(location.search).get("search_query");
      const decodedSearchQuery = searchQuery ? decodeURIComponent(searchQuery) : "";
      console.log("decoded search", decodedSearchQuery);
      if (decodedSearchQuery.length > 0) {
        setSearch(decodedSearchQuery);
      }
    }
  }, [pathname, location.search]);

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

  const navigate = useNavigate();
  const handleSearch = () => {
    const trimmedSearch = search.trim();

    if (trimmedSearch.length > 0) {
      navigate(`/results?search_query=${encodeURIComponent(trimmedSearch)}`);
    }
  };

  // End Log out modal Code

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <Grid container direction="row" columnSpacing={1}>
          <Grid item xs={12} md={11}>
            <Grid container direction="row" columnSpacing={1}>
              <Grid item xs={1}>
                <IconButton size="small" disableRipple color="inherit" onClick={handleMiniSidenav}>
                  <Icon sx={iconsStyle} fontSize="medium">
                    {miniSidenav ? "menu" : "menu_open"}
                  </Icon>
                </IconButton>
              </Grid>
              <Grid item xs={11}>
                <MDBox sx={{ width: "100%" }}>
                  <MDInput
                    label="Search here"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    fullWidth
                  />
                </MDBox>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={1}>
            {isMini ? null : (
              <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
                <Grid container direction="row" justifyContent="flex-end" alignItems="center">
                  <Grid item>
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
                        sx={navbarIconButton}
                        onClick={handleConfiguratorOpen}
                      >
                        <Icon sx={iconsStyle}>settings</Icon>
                      </IconButton>
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            )}
          </Grid>
        </Grid>
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

// Setting default values for the props of StudioNavbar
StudioNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the StudioNavbar
StudioNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default StudioNavbar;
