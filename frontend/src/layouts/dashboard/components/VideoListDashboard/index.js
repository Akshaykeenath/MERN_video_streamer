import { useCallback, useMemo, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";
import PropTypes from "prop-types";
import { encodeUrlVideoId } from "functions/general/encription";

// Data
import data from "layouts/dashboard/components/VideoListDashboard/data";
import { useLocation, useNavigate } from "react-router-dom";

const getCurrentUrl = () => {
  const location = useLocation();
  return location.pathname + location.search + location.hash;
};

function VideoListDashboard({ videoList }) {
  const navigate = useNavigate();
  const prevUrl = getCurrentUrl();
  const handleVideoListAction = useCallback((funcData) => {
    if (funcData && funcData.action === "view") {
      const encodedVideoID = encodeUrlVideoId(funcData.id);
      navigate(`/studio/analytics/video?video_id=${encodedVideoID}`, {
        state: { prevUrl: prevUrl },
      });
    }
  });

  const { columns, rows } = useMemo(
    () => data({ videoList, onVideoListAction: handleVideoListAction }),
    [videoList]
  );
  const [menu, setMenu] = useState(null);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Recent Videos
          </MDTypography>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
      </MDBox>
      <MDBox>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  );
}

VideoListDashboard.propTypes = {
  videoList: PropTypes.any,
};

export default VideoListDashboard;
