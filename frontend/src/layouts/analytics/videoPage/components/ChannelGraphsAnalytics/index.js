import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import PropTypes from "prop-types";
import { ButtonGroup, Grid, Tab, Tabs } from "@mui/material";
import MDButton from "components/MDButton";
import VerticalBarChart from "examples/Charts/BarCharts/VerticalBarChart";
import getAllChartData from "layouts/analytics/videoPage/components/ChannelGraphsAnalytics/data";
import DefaultLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import PieChart from "examples/Charts/PieChart";
import DefaultDoughnutChart from "examples/Charts/DoughnutCharts/DefaultDoughnutChart";

function ChannelGraphsAnalytics({ graphData }) {
  const { fetchChartData, viewsChartData, likesChartData } = getAllChartData();
  const [menu, setMenu] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [graphDuration, setGraphDuration] = useState("days");
  const [graphDescription, setGraphDescription] = useState("");
  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  useEffect(() => {
    let duration = 7;
    if (graphDuration) {
      if (graphDuration == "days") {
        duration = 7;
      } else if (graphDuration == "month") {
        duration = 30;
      } else if (graphDuration == "full") {
        duration = 100;
      }
    }
    if (graphData) {
      fetchChartData(graphData, duration);
    }
  }, [graphData, graphDuration]);

  useEffect(() => {
    if (graphDuration == "days") {
      setGraphDescription("Last 7 days");
    } else if (graphDuration == "month") {
      setGraphDescription("Last 30 days");
    } else if (graphDuration == "full") {
      setGraphDescription("Lifetime data");
    }
  }, [graphDuration]);

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
      <MenuItem
        onClick={() => {
          setMenu(null);
          setGraphDuration("days");
        }}
      >
        Last 7 days
      </MenuItem>
      <MenuItem
        onClick={() => {
          setMenu(null);
          setGraphDuration("month");
        }}
      >
        Last 30 days
      </MenuItem>
      <MenuItem
        onClick={() => {
          setMenu(null);
          setGraphDuration("full");
        }}
      >
        LifeTime
      </MenuItem>
    </Menu>
  );

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} pr={3} pl={2}>
        <MDBox>
          <ButtonGroup variant="outlined" aria-label="loading button group">
            <MDButton
              color="info"
              size="small"
              variant={tabIndex == 0 ? "gradient" : "outlined"}
              onClick={() => setTabIndex(0)}
            >
              Views
            </MDButton>
            <MDButton
              color="info"
              size="small"
              variant={tabIndex == 1 ? "gradient" : "outlined"}
              onClick={() => setTabIndex(1)}
            >
              Likes
            </MDButton>
          </ButtonGroup>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
      </MDBox>
      <MDBox px={2} pb={2}>
        {tabIndex == 0 && (
          <MDBox>
            {viewsChartData && (
              <DefaultLineChart
                // icon={{ color: "info", component: "leaderboard" }}
                title={graphDescription}
                // description={graphDescription}
                chart={viewsChartData}
              />
            )}
          </MDBox>
        )}
        {tabIndex == 1 && (
          <MDBox>
            <DefaultDoughnutChart
              // icon={{ color: "info", component: "leaderboard" }}
              title={graphDescription}
              // description={graphDescription}
              chart={likesChartData}
            />
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

ChannelGraphsAnalytics.propTypes = {
  graphData: PropTypes.any,
};

export default ChannelGraphsAnalytics;
