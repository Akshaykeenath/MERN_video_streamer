/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import getChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useEffect, useMemo, useState } from "react";
import { useRouteRedirect } from "services/redirection";
import { getDashboardData } from "services/userManagement";
import { Typography } from "@mui/material";
import { getRelativeTime } from "functions/general/time";
import { analyzeStatisticsCardData } from "functions/general/graphDatas";

function Dashboard() {
  const redirect = useRouteRedirect();
  const { fetchChartData, subscribersChartData, viewsChartData, likesChartData } = getChartData();
  const { fetchData, response, error } = getDashboardData();
  const { sales, tasks } = reportsLineChartData;
  const [statisticsCardData, setStatisticsCardData] = useState(null);
  const [statisticsCardData2, setStatisticsCardData2] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [graphData, setGraphData] = useState(null);

  const getAbbreviatedDay = (dateString) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const myDate = new Date(dateString);
    const dayOfWeek = myDate.getDay();
    const abbreviatedDayString = days[dayOfWeek];
    return abbreviatedDayString;
  };

  useEffect(() => {
    fetchData();
    const currentTimestampString = new Date().toISOString();
    setCurrentTime(currentTimestampString);
    const inputDate = "2023-12-26";
    console.log("day of the week : ", getAbbreviatedDay(inputDate));
  }, []);
  useEffect(() => {
    if (graphData) {
      fetchChartData(graphData);
    }
  }, [graphData]);
  useEffect(() => {
    if (response) {
      console.log(response);
      if (response.message.statisticsCardData) {
        setStatisticsCardData(response.message.statisticsCardData);
      }
      if (response.message.processedData) {
        setStatisticsCardData2(analyzeStatisticsCardData(response.message.processedData));
        setGraphData(response.message.processedData);
      }
    }
    if (error) {
      console.log(error);
    }
  }, [response, error]);
  useEffect(() => {
    if (statisticsCardData2) {
      console.log(statisticsCardData2);
    }
  }, [statisticsCardData2]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* StatisticsCards  */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="video_call"
                title="Videos"
                count={statisticsCardData ? statisticsCardData.videos : ""}
                percentage={{
                  color: "success",
                  amount: "",
                  label: currentTime && "Updated " + getRelativeTime(currentTime).toLowerCase(),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="person_add"
                title="Subscribers"
                count={statisticsCardData2 ? statisticsCardData2.subscribers.totalCount : ""}
                percentage={{
                  color:
                    statisticsCardData2 && statisticsCardData2.subscribers.percentageDifference > 0
                      ? "success"
                      : "error",
                  amount: statisticsCardData2
                    ? statisticsCardData2.subscribers.percentageDifference + "%"
                    : "",
                  label:
                    statisticsCardData2 &&
                    (statisticsCardData2.subscribers.duration === "day"
                      ? "than yesterday"
                      : "than last " + statisticsCardData2.subscribers.duration),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="visibility"
                title="Total Views"
                count={statisticsCardData2 ? statisticsCardData2.views.totalCount : ""}
                percentage={{
                  color:
                    statisticsCardData2 && statisticsCardData2.views.percentageDifference > 0
                      ? "success"
                      : "error",
                  amount: statisticsCardData2
                    ? statisticsCardData2.views.percentageDifference + "%"
                    : "",
                  label:
                    statisticsCardData2 &&
                    (statisticsCardData2.views.duration === "day"
                      ? "than yesterday"
                      : "than last " + statisticsCardData2.views.duration),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="favorite"
                title="User Interactions"
                count={statisticsCardData2 ? statisticsCardData2.likes.totalCount : ""}
                percentage={{
                  color:
                    statisticsCardData2 && statisticsCardData2.likes.percentageDifference > 0
                      ? "success"
                      : "error",
                  amount: statisticsCardData2
                    ? statisticsCardData2.likes.percentageDifference + "%"
                    : "",
                  label:
                    statisticsCardData2 &&
                    (statisticsCardData2.likes.duration === "day"
                      ? "than yesterday"
                      : "than last " + statisticsCardData2.likes.duration),
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        {/* End statisticsCards  */}

        {/* Charts  */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                {subscribersChartData && (
                  <ReportsBarChart
                    color="info"
                    title="subscribers"
                    description="Last weeks subscribers count"
                    date={"Updated " + getRelativeTime(currentTime).toLowerCase()}
                    chart={subscribersChartData}
                  />
                )}
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                {viewsChartData && (
                  <ReportsLineChart
                    color="success"
                    title="Views"
                    description="Last weeks views data"
                    date={"Updated " + getRelativeTime(currentTime).toLowerCase()}
                    chart={viewsChartData}
                  />
                )}
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                {likesChartData && (
                  <ReportsLineChart
                    color="primary"
                    title="Likes and dislikes"
                    description="Likes and dislikes of last week"
                    date={"Updated " + getRelativeTime(currentTime).toLowerCase()}
                    chart={likesChartData}
                  />
                )}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        {/* End Charts */}
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
