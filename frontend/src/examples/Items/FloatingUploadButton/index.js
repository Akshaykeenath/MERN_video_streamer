import { Icon, Slide, Tooltip } from "@mui/material";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRouteRedirect } from "services/redirection";

function FloatingUploadVideoButton() {
  const redirect = useRouteRedirect();
  const { pathname } = useLocation();
  const [display, setDisplay] = useState(false);
  const execptionList = ["/studio/videos", "/studio/videos/upload", "/authentication"];

  useEffect(() => {
    if (!execptionList.some((path) => pathname.startsWith(path))) {
      setDisplay(true);
    } else {
      setDisplay(false);
    }
  }, [pathname]);

  return (
    <Slide direction="up" in={display} timeout={{ exit: 100 }} mountOnEnter unmountOnExit>
      <Tooltip title="Upload Video" arrow>
        <MDButton
          color="info"
          iconOnly
          circular
          size="large"
          sx={{
            right: "0px",
            bottom: "0px",
            position: "fixed",
            marginBottom: "1rem",
            marginRight: "1rem",
            zIndex: 100,
          }}
          onClick={() => redirect("videoUpload")}
        >
          <Icon>add</Icon>
        </MDButton>
      </Tooltip>
    </Slide>
  );
}

export default FloatingUploadVideoButton;
