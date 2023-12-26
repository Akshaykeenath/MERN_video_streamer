import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Video Streamer React components
import MDBox from "components/MDBox";

// Video Streamer React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Video Streamer React themes
import theme from "assets/theme";

// Video Streamer React Dark Mode themes
import themeDark from "assets/theme-dark";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Video Streamer React routes
import { routes } from "routes";

// Video Streamer React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/brand_white.png";
import brandDark from "assets/images/brand_dark.png";
import { KEAlert, KEAlertOther } from "components/KEAlert/index";
import StudioSidenav from "examples/Sidenav/StudioSidenav";
import { useRouteRedirect } from "services/redirection";
import { Fab } from "@mui/material";
import MDButton from "components/MDButton";
import FloatingUploadVideoButton from "examples/Items/FloatingUploadButton";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
    isAuthenticated,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const redirect = useRouteRedirect();

  function isPathProtected(currentPath) {
    const route = routes.find((r) => r.route === currentPath);
    return route && route.protected;
  }

  useState(() => {
    const isProtected = isPathProtected(pathname);
    if (isProtected) {
      redirect("checkAuth");
    }
  }, []);

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.protected && !isAuthenticated) {
        // Redirect to the login page
        return (
          <Route
            path={route.route}
            element={<Navigate to="/authentication/sign-in" state={{ prevUrl: pathname }} />}
            key={route.key}
          />
        );
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          {pathname.startsWith("/studio") ? (
            <StudioSidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName={pathname.startsWith("/studio") ? "KeTube Studio" : "KeTube"}
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
          ) : (
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName={pathname.startsWith("/studio") ? "KeTube Studio" : "KeTube"}
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
          )}
          <Configurator />
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <FloatingUploadVideoButton />
      <KEAlert />
      <KEAlertOther />
    </ThemeProvider>
  );
}
